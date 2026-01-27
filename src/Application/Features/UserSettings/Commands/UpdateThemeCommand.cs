using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.UserSettings.Commands;

public sealed record UpdateThemeCommand(Guid UserId, string Theme) : IRequest<Result<ThemePreference>>;

public sealed class UpdateThemeCommandValidator : AbstractValidator<UpdateThemeCommand>
{
    public UpdateThemeCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя обязателен");

        RuleFor(x => x.Theme)
            .NotEmpty().WithMessage("Тема обязательна")
            .Must(BeValidTheme).WithMessage("Недопустимое значение темы");
    }

    private static bool BeValidTheme(string theme) =>
        theme.Equals("dark", StringComparison.OrdinalIgnoreCase) ||
        theme.Equals("light", StringComparison.OrdinalIgnoreCase);
}

internal sealed class UpdateThemeCommandHandler : IRequestHandler<UpdateThemeCommand, Result<ThemePreference>>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateThemeCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ThemePreference>> Handle(UpdateThemeCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);

        if (user is null)
            return Result.Failure<ThemePreference>("Пользователь не найден");

        var theme = request.Theme.Equals("light", StringComparison.OrdinalIgnoreCase)
            ? ThemePreference.Light
            : ThemePreference.Dark;

        user.UpdateTheme(theme);
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(ct);

        return theme;
    }
}
