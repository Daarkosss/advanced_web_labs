import React, { useEffect, useRef } from "react";
import { store } from "../../store/store";
import { observer } from "mobx-react-lite";
import "../../scss/main.scss";
import { MessageItem } from "./MessageItem";
import { reaction } from "mobx";

export const MessageList = observer (() => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // Dodanie minimalnego opóźnienia, aby upewnić się, że przewijanie wykonuje się po aktualizacji DOM
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };
  
  useEffect(() => {
    const dispose = reaction(
      () => [store.messages.slice(), store.typingUsers.slice()],
      () => scrollToBottom(),
      { fireImmediately: true }
    );

    return () => dispose();
  }, []);

  return (
    <div className="message_list">
      {store.messages.map((x, idx) => (
        <MessageItem key={idx} message={x} />
      ))}
      {store.typingUsers.map(user => (
        <div key={user} className="typing_status">
          {user} is typing...
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});
