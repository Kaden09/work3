using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Chats.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Chats.Queries;

public sealed record GetUserChatsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<ChatDto>>>;

internal sealed class GetUserChatsQueryHandler : IRequestHandler<GetUserChatsQuery, Result<IReadOnlyList<ChatDto>>>
{
    private readonly IChatRepository _chatRepo;
    private readonly IMessageRepository _msgRepo;

    public GetUserChatsQueryHandler(IChatRepository chatRepo, IMessageRepository msgRepo)
    {
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
    }

    public async Task<Result<IReadOnlyList<ChatDto>>> Handle(GetUserChatsQuery request, CancellationToken ct)
    {
        var chats = await _chatRepo.GetByUserIdAsync(request.UserId, ct);

        // filter chats that have messages in DB
        var chatsWithMessages = new List<ChatDto>();
        foreach (var c in chats)
        {
            var msgs = await _msgRepo.GetByChatIdAsync(c.Id, 1, ct);
            if (msgs.Count > 0)
            {
                chatsWithMessages.Add(new ChatDto(
                    c.Id,
                    c.ContactName,
                    c.ContactAvatar,
                    c.LastMessageText,
                    c.LastMessageAt,
                    c.UnreadCount));
            }
        }

        return chatsWithMessages;
    }
}
