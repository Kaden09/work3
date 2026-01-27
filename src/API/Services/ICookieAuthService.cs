namespace MessagingPlatform.API.Services;

public interface ICookieAuthService
{
    void SetTokens(HttpContext context, string accessToken, string refreshToken, DateTime refreshExpiry);
    void ClearTokens(HttpContext context);
    string? GetRefreshToken(HttpContext context);
}
