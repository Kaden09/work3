using System.Security.Claims;

namespace MessagingPlatform.API.Utilities;

public static class ClaimsExtractor
{
    public static bool TryGetUserId(ClaimsPrincipal principal, out Guid userId)
    {
        userId = Guid.Empty;
        var claim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(claim))
            return false;

        return Guid.TryParse(claim, out userId);
    }
}
