using MessagingPlatform.API.Constants;

namespace MessagingPlatform.API.Middleware;

public sealed class CookieAuthMiddleware
{
    private readonly RequestDelegate _next;

    public CookieAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.ContainsKey("Authorization"))
        {
            var accessToken = context.Request.Cookies[CookieNames.AccessToken];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Request.Headers.Append("Authorization", $"Bearer {accessToken}");
            }
        }

        await _next(context);
    }
}
