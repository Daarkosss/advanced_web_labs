import React, { useEffect, useState } from "react";
import { useSocket } from "../../customHooks/useSocket";
import { IoSendSharp  } from "react-icons/io5";
import "../../scss/main.scss";
import { MessageList } from "./MessageList";
import { useFetch } from "../../customHooks/useFetch";

export const Message = ({ room, username, setLoggedIn }) => {
  const { socketResponse, sendData, typingUsers, setTypingUsers, sendTypingSignal } = useSocket(room, username);
  const [messageInput, setMessageInput] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typingTimeoutId, setTypingTimeoutId] = useState(null);

  const { responseData } = useFetch("/message/" + room);

  const addMessageToList = (val) => {
    if (val.room === "") return;
    setMessageList([...messageList, val]);
  };

  useEffect(() => {
    if (responseData !== null) {
      console.log(responseData);
      setMessageList([...responseData.messages, ...messageList]);
      setTypingUsers([...responseData.typingUsers, ...typingUsers]);
    }
  }, [responseData]);

  useEffect(() => {
    console.log("Socket Response: ", socketResponse);
    addMessageToList(socketResponse);
  }, [socketResponse]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log('sending message')
    if (messageInput !== "") {
      sendData({
        content: messageInput,
      });
      addMessageToList({
        content: messageInput,
        username: username,
        createdDateTime: new Date(),
        messageType: "CLIENT",
      });
      setMessageInput("");
    }
  };

  const leaveRoom = () => {
    setLoggedIn(false);
    room = null;
  }

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setMessageInput(newInput);
  
    if (newInput !== "") {
      // User started typing
      if (!typingTimeoutId) {
        sendTypingSignal(true);
      }
  
      // Reset the timer if the user is still typing
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        sendTypingSignal(false);
        setTypingTimeoutId(null);
      }, 5000);  // 3 seconds without typing = user stopped typing
      setTypingTimeoutId(timeoutId);
    } else {
      // If input is empty and the user stopped typing, reset the timer
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        setTypingTimeoutId(null);
        sendTypingSignal(false);
      }
    }
  };

  return (
    <div className="message_root_div">
      <span className="room_name">Room: {room} </span>
      <span className="user_name">Welcome: {username} </span>
      <button className="leave-button" onClick={ leaveRoom }>Leave room</button>
      <div className="message_component">
        <MessageList username={username} messageList={messageList} typingUsers={typingUsers}/>
        <form className="chat-input" onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => handleInputChange(e)}
            placeholder="Type a message"
          />
          <button type="submit" className="send-button" disabled={ messageInput === "" }>
              <IoSendSharp size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};
