using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Auth.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Auth.Commands;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string? FirstName,
    string? LastName) : IRequest<Result<AuthResponse>>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен")
            .EmailAddress().WithMessage("Некорректный email")
            .MaximumLength(256).WithMessage("Email слишком длинный");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен")
            .MinimumLength(8).WithMessage("Минимум 8 символов")
            .MaximumLength(128).WithMessage("Максимум 128 символов")
            .Matches(@"[A-Z]").WithMessage("Нужна заглавная буква (A-Z)")
            .Matches(@"[a-z]").WithMessage("Нужна строчная буква (a-z)")
            .Matches(@"[0-9]").WithMessage("Нужна цифра (0-9)")
            .Matches(@"[^a-zA-Z0-9]").WithMessage("Нужен спецсимвол (!@#$%^&*)");

        RuleFor(x => x.FirstName)
            .MaximumLength(100).WithMessage("Имя слишком длинное");

        RuleFor(x => x.LastName)
            .MaximumLength(100).WithMessage("Фамилия слишком длинная");
    }
}

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public RegisterCommandHandler(
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

    public async Task<Result<AuthResponse>> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = Email.Create(request.Email);

        if (await _userRepository.ExistsAsync(email, ct))
            return Result.Failure<AuthResponse>("Пользователь с таким email уже существует");

        var passwordHash = PasswordHash.Create(_passwordHasher.Hash(request.Password));
        var user = User.Create(email, passwordHash);

        if (!string.IsNullOrWhiteSpace(request.FirstName) || !string.IsNullOrWhiteSpace(request.LastName))
            user.UpdateProfile(request.FirstName, request.LastName);

        await _userRepository.AddAsync(user, ct);

        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshTokenValue = _jwtProvider.GenerateRefreshToken();
        var refreshToken = RefreshToken.Create(user.Id, refreshTokenValue, 7);

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
