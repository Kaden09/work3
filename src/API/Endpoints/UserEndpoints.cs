using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Features.UserSettings.Commands;

namespace MessagingPlatform.API.Endpoints;

public static class UserEndpoints
{
    public sealed class UpdateThemeRequest
    {
        [JsonPropertyName("theme")]
        public string Theme { get; set; } = string.Empty;
    }

    public sealed record ThemeResponseDto(string Theme);

    public static async Task<IResult> UpdateTheme(
        UpdateThemeRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<ThemeResponseDto>.Failure("Unauthorized"));

        var command = new UpdateThemeCommand(userId, request.Theme);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<ThemeResponseDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<ThemeResponseDto>.Success(
            new ThemeResponseDto(result.Value.ToString().ToLowerInvariant())));
    }
}
