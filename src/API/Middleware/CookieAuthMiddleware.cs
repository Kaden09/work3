namespace MessagingPlatform.API.Middleware;

public sealed class CookieAuthMiddleware
{
    private const string AccessTokenCookie = "access_token";
    private readonly RequestDelegate _next;

    public CookieAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.ContainsKey("Authorization"))
        {
            var accessToken = context.Request.Cookies[AccessTokenCookie];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Request.Headers.Append("Authorization", $"Bearer {accessToken}");
            }
        }

        await _next(context);
    }
}
