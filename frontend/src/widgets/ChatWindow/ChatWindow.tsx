import { useEffect, useRef, useState } from "react";
import { getChatMessages, type Message } from "../../shared/api/requests/chats";

interface ChatWindowProps {
  chatId: string;
}

function ChatWindow({ chatId }: ChatWindowProps) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getChatMessages(chatId);
      setMsgs(data);
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const hrs = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${hrs}:${mins}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-font-secondary">
        Загрузка...
      </div>
    );
  }

  if (msgs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-font-secondary">
        История сообщений недоступна.<br/>Вы можете отправить новое сообщение ниже.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto flex flex-col gap-3 pb-3"
    >
      {msgs.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.isFromCustomer ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`max-w-[70%] md:max-w-[60%] px-4 py-2 rounded-2xl ${
              m.isFromCustomer
                ? "bg-chat-message-customer text-font-primary"
                : "bg-primary text-white"
            }`}
          >
            <div className="text-sm break-words whitespace-pre-wrap">{m.text}</div>
            <div
              className={`text-xs mt-1 ${
                m.isFromCustomer ? "text-font-secondary" : "text-white/70"
              }`}
            >
              {formatTime(m.sentAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
