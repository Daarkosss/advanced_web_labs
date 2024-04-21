import { useCallback, useEffect, useState } from "react";
import * as io from "socket.io-client";
import { SOCKET_BASE_URL } from "../constants/apiConstants";

export const useSocket = (room, username) => {
  const [socket, setSocket] = useState();
  const [typingUsers, setTypingUsers] = useState([]);
  const [socketResponse, setSocketResponse] = useState({
    room: "",
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });
  const [isConnected, setConnected] = useState(false);

  const sendData = useCallback(
    (payload) => {
      console.log('sending message to socket', payload);
      socket.emit("send_message", {
        room: room,
        content: payload.content,
        username: username,
        messageType: "CLIENT",
      });
    },
    [socket, room]
  );

  const sendTypingSignal  = useCallback((isTyping) => {
    console.log('sending typing', isTyping);
    socket.emit("typing", { 
      username: username, 
      room: room, 
      isTyping: isTyping 
    });
  }, [socket, room, username]);

  useEffect(() => {
    const s = io(SOCKET_BASE_URL, {
      reconnection: false,
      query: `username=${username}&room=${room}`,
    });
    setSocket(s);

    s.on("connect", () => {
      setConnected(true);
    });

    s.on("typing", (receivedUsername, isTyping) => {
      setTypingUsers(currentTypingUsers => {
        const isCurrentlyTyping = currentTypingUsers.includes(receivedUsername);
        if (isTyping && !isCurrentlyTyping) {
          return [...currentTypingUsers, receivedUsername];
        } else if (!isTyping && isCurrentlyTyping) {
          return currentTypingUsers.filter(user => user !== receivedUsername);
        } else {
          return currentTypingUsers;
        }
      });
    });

    s.on("read_message", (res) => {
      console.log(res);
      setTypingUsers(typingUsers.filter((x) => x !== username));
      setSocketResponse({
        room: res.room,
        content: res.content,
        username: res.username,
        messageType: res.messageType,
        createdDateTime: res.createdDateTime,
      });
    });

    return () => {
      console.log("disconnecting websocket");
      s.disconnect();
    };
  }, [room]);

  useEffect(() => {
    console.log("Typing users updated:", typingUsers);
  }, [typingUsers]);

  return { socketResponse, isConnected, sendData, typingUsers, setTypingUsers, sendTypingSignal};
};
