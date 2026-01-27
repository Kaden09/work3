using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Primitives;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Domain.Entities;

public sealed class User : AggregateRoot<Guid>
{
    private const int MaxFailedAttempts = 5;
    private const int LockoutMinutes = 15;

    public Email Email { get; private set; } = null!;
    public PasswordHash PasswordHash { get; private set; } = null!;
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public UserRole Role { get; private set; }
    public ThemePreference Theme { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    public int FailedLoginAttempts { get; private set; }
    public DateTime? LockoutEndAt { get; private set; }

    private User() { }

    private User(Guid id, Email email, PasswordHash passwordHash, UserRole role) : base(id)
    {
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        Theme = ThemePreference.Dark;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
    }

    public static User Create(Email email, PasswordHash passwordHash, UserRole role = UserRole.User)
    {
        var user = new User(Guid.NewGuid(), email, passwordHash, role);
        return user;
    }

    public bool IsLockedOut => LockoutEndAt.HasValue && LockoutEndAt.Value > DateTime.UtcNow;

    public void UpdateProfile(string? firstName, string? lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public void UpdatePassword(PasswordHash newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }

    public void RecordSuccessfulLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        LockoutEndAt = null;
    }

    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        if (FailedLoginAttempts >= MaxFailedAttempts)
        {
            LockoutEndAt = DateTime.UtcNow.AddMinutes(LockoutMinutes);
        }
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;

    public void ChangeRole(UserRole newRole) => Role = newRole;

    public void UpdateTheme(ThemePreference theme) => Theme = theme;
}
