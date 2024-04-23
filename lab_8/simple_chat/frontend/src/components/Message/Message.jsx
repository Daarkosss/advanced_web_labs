import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../store/store";
import { MessageList } from "./MessageList";
import { IoSendSharp } from "react-icons/io5";

export const Message = observer(() => {
  const [messageInput, setMessageInput] = useState("");
  const [typingTimeoutId, setTypingTimeoutId] = useState(null);

  useEffect(() => {
    store.getRoomMessages();
    store.connectWithSocket();

    return () => {
      console.log("disconnecting websocket");
      store.disconnectWithSocket();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput !== "") {
      setTypingTimeoutId(null);
      store.sendMessage(messageInput, store.username, store.room);
      store.addMessage({
        content: messageInput,
        username: store.username,
        createdDateTime: new Date(),
        messageType: "CLIENT",
      });
      setMessageInput("");
    }
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setMessageInput(newInput);

    if (newInput !== "") {
      if (!typingTimeoutId) {
        store.sendTypingSignal(true);
      }
      clearTimeout(typingTimeoutId);
      const timeoutId = setTimeout(() => {
        store.sendTypingSignal(false);
        setTypingTimeoutId(null);
      }, 3000);
      setTypingTimeoutId(timeoutId);
    } else {
      clearTimeout(typingTimeoutId);
      setTypingTimeoutId(null);
      store.sendTypingSignal(false);
    }
  };

  return (
    <div className="message_root_div">
      <span className="room_name">Room: {store.room}</span>
      <span className="user_name">Welcome: {store.username}</span>
      <button className="leave-button" onClick={() => store.logout()}>Leave room</button>
      <div className="message_component">
        <MessageList/>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message"
            maxLength={1000}
          />
          <button type="submit" className="send-button" disabled={messageInput === ""}>
            <IoSendSharp size={22} />
          </button>
        </form>
      </div>
    </div>
  );
});

export default Message;
