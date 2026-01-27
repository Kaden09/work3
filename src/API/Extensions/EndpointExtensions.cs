using MessagingPlatform.API.Endpoints;

namespace MessagingPlatform.API.Extensions;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/Auth")
            .WithTags("Authentication");

        group.MapGet("/", () => Results.Ok(new
        {
            service = "MessagingPlatform API",
            version = "1.0.0",
            endpoints = new[]
            {
                "POST /api/Auth/register",
                "POST /api/Auth/login",
                "POST /api/Auth/logout",
                "POST /api/Auth/refresh",
                "GET /api/Auth/me"
            }
        })).WithName("ApiInfo").WithSummary("API information");

        group.MapPost("/register", AuthEndpoints.Register)
            .WithName("Register")
            .WithSummary("Register a new user")
            .RequireRateLimiting("auth")
            .Accepts<AuthEndpoints.RegisterRequest>("application/json")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/login", AuthEndpoints.Login)
            .WithName("Login")
            .WithSummary("Login with credentials")
            .RequireRateLimiting("auth")
            .Accepts<AuthEndpoints.LoginRequest>("application/json")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh", AuthEndpoints.RefreshToken)
            .WithName("RefreshToken")
            .WithSummary("Refresh access token")
            .RequireRateLimiting("auth")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/logout", AuthEndpoints.Logout)
            .WithName("Logout")
            .WithSummary("Logout and revoke refresh token")
            .RequireRateLimiting("auth")
            .Produces<bool>(StatusCodes.Status200OK);

        group.MapGet("/me", AuthEndpoints.GetCurrentUser)
            .WithName("GetCurrentUser")
            .WithSummary("Get current user info")
            .RequireAuthorization()
            .RequireRateLimiting("api")
            .Produces<AuthEndpoints.UserResponseDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        return app;
    }

    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/User")
            .WithTags("User")
            .RequireAuthorization();

        group.MapPut("/theme", UserEndpoints.UpdateTheme)
            .WithName("UpdateTheme")
            .WithSummary("Update user theme preference")
            .RequireRateLimiting("api")
            .Accepts<UserEndpoints.UpdateThemeRequest>("application/json")
            .Produces<UserEndpoints.ThemeResponseDto>(StatusCodes.Status200OK);

        return app;
    }
}
