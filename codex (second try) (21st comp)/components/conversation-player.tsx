"use client";

const messages = [
  { inbound: true, text: "Where is my order?" },
  { inbound: false, text: "Your order is on its way." },
  { inbound: true, text: "When will it arrive?" },
  { inbound: false, text: "Tomorrow." },
];

export function ConversationPlayer() {
  return (
    <div className="conversation-player" aria-hidden="true">
      <header><span>Support</span><strong>Autonomy</strong></header>
      <div className="conversation-body">
        {messages.map((message, index) => (
          <div className={message.inbound ? "bubble inbound" : "bubble outbound"} key={message.text} style={{ "--message-index": index } as React.CSSProperties}>{message.text}</div>
        ))}
        <div className="typing-indicator"><i /><i /><i /></div>
      </div>
    </div>
  );
}
