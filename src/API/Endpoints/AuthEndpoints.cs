using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.Application.Features.Auth.Commands;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.API.Endpoints;

public static class AuthEndpoints
{
    private const string AccessTokenCookie = "access_token";
    private const string RefreshTokenCookie = "refresh_token";

    public sealed class RegisterRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }
    }

    public sealed class LoginRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("rememberMe")]
        public bool RememberMe { get; set; }
    }

    public sealed record AuthResponseDto(Guid UserId, string Email);
    public sealed record UserResponseDto(Guid Id, string Email, string? FirstName, string? LastName, string Role, string Theme);

    public static async Task<IResult> Register(RegisterRequest request, HttpContext httpContext, ISender sender)
    {
        var command = new RegisterCommand(request.Email, request.Password, request.FirstName, request.LastName);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        SetAuthCookies(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> Login(LoginRequest request, HttpContext httpContext, ISender sender)
    {
        var command = new LoginCommand(request.Email, request.Password, request.RememberMe);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        SetAuthCookies(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> RefreshToken(HttpContext httpContext, ISender sender)
    {
        var refreshToken = httpContext.Request.Cookies[RefreshTokenCookie];

        if (string.IsNullOrEmpty(refreshToken))
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure("No refresh token provided"));

        var command = new RefreshTokenCommand(refreshToken);
        var result = await sender.Send(command);

        if (result.IsFailure)
        {
            ClearAuthCookies(httpContext);
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));
        }

        SetAuthCookies(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> GetCurrentUser(ClaimsPrincipal user, IUserRepository userRepository)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Results.Ok(ApiResponse<UserResponseDto>.Failure("Unauthorized"));

        var dbUser = await userRepository.GetByIdAsync(userId);

        if (dbUser is null)
            return Results.Ok(ApiResponse<UserResponseDto>.Failure("User not found"));

        return Results.Ok(ApiResponse<UserResponseDto>.Success(new UserResponseDto(
            dbUser.Id,
            dbUser.Email.Value,
            dbUser.FirstName,
            dbUser.LastName,
            dbUser.Role.ToString(),
            dbUser.Theme.ToString().ToLowerInvariant())));
    }

    public static async Task<IResult> Logout(HttpContext httpContext, ISender sender)
    {
        var refreshToken = httpContext.Request.Cookies[RefreshTokenCookie];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var command = new LogoutCommand(refreshToken);
            await sender.Send(command);
        }

        ClearAuthCookies(httpContext);

        return Results.Ok(ApiResponse<bool>.Success(true));
    }

    private static void SetAuthCookies(HttpContext httpContext, string accessToken, string refreshToken, DateTime refreshTokenExpiry)
    {
        var isHttps = httpContext.Request.IsHttps ||
                      string.Equals(httpContext.Request.Headers["X-Forwarded-Proto"], "https", StringComparison.OrdinalIgnoreCase);
        var sameSite = isHttps ? SameSiteMode.Strict : SameSiteMode.Lax;

        httpContext.Response.Cookies.Append(AccessTokenCookie, accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = sameSite,
            Expires = DateTimeOffset.UtcNow.AddMinutes(15),
            Path = "/"
        });

        httpContext.Response.Cookies.Append(RefreshTokenCookie, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = sameSite,
            Expires = refreshTokenExpiry,
            Path = "/api/Auth"
        });
    }

    private static void ClearAuthCookies(HttpContext httpContext)
    {
        httpContext.Response.Cookies.Delete(AccessTokenCookie, new CookieOptions { Path = "/" });
        httpContext.Response.Cookies.Delete(RefreshTokenCookie, new CookieOptions { Path = "/api/Auth" });
    }
}
