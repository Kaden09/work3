using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Auth.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Auth.Commands;

public sealed record LoginCommand(string Email, string Password, bool RememberMe = false) : IRequest<Result<AuthResponse>>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен")
            .EmailAddress().WithMessage("Некорректный email");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен");
    }
}

internal sealed class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<AuthResponse>> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = Email.Create(request.Email);
        var user = await _userRepository.GetByEmailAsync(email, ct);

        if (user is null)
            return Result.Failure<AuthResponse>("Неверный email или пароль");

        if (!user.IsActive)
            return Result.Failure<AuthResponse>("Аккаунт деактивирован");

        if (user.IsLockedOut)
            return Result.Failure<AuthResponse>("Аккаунт временно заблокирован. Попробуйте позже");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash.Value))
        {
            user.RecordFailedLogin();
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync(ct);
            return Result.Failure<AuthResponse>("Неверный email или пароль");
        }

        user.RecordSuccessfulLogin();
        _userRepository.Update(user);

        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshTokenValue = _jwtProvider.GenerateRefreshToken();
        var tokenExpiryDays = request.RememberMe ? 30 : 7;
        var refreshToken = RefreshToken.Create(user.Id, refreshTokenValue, tokenExpiryDays);

        await _refreshTokenRepository.AddAsync(refreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponse(
            user.Id,
            user.Email.Value,
            accessToken,
            refreshTokenValue,
            refreshToken.ExpiresAt);
    }
}
