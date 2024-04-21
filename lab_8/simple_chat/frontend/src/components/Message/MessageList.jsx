import React, { useEffect, useRef } from "react";
import "../../scss/main.scss";
import { MessageItem } from "./MessageItem";

export const MessageList = ({ username, messageList, typingUsers }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messageList, typingUsers]);

  return (
    <div className="message_list">
      {messageList.map((x, idx) => (
        <MessageItem key={idx} message={x} username={username} />
      ))}
      {typingUsers.map(user => (
        <div key={user} className="typing_status">
          {user} is typing...
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
