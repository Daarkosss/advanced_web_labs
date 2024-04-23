import io from "socket.io-client";
import { SOCKET_BASE_URL } from "./api";

class SocketManager {
  constructor(store) {
    this.store = store;
    this.connect();
  }

  connect() {
    this.socket = io(SOCKET_BASE_URL, {
      reconnection: false,
      query: `username=${this.store.username}&room=${this.store.room}`
    });
    console.log('XD');

    this.socket.on("connect", () => {
      console.log("Connected to socket");
    });

    this.socket.on("typing", (receivedUsername, isTyping) => {
      console.log('received typing', receivedUsername, isTyping);
      if (isTyping) {
        if (receivedUsername !== this.store.username)
        {
          this.store.addTypingUser(receivedUsername);
        }
      } else {
        this.store.removeTypingUser(receivedUsername);
      }
    });

    this.socket.on("read_message", (res) => {
      this.store.addMessage(res);
      this.store.removeTypingUser(res.username);
    });
  }

  sendTypingSignal(isTyping) {
    console.log('sending typing', isTyping);
    this.socket.emit("typing", {
      username: this.store.username,
      room: this.store.room,
      isTyping: isTyping
    });
  }

  sendData(payload) {
    console.log('sending message to socket', payload);
    this.socket.emit("send_message", {
      room: this.store.room,
      content: payload.content,
      username: this.store.username,
      messageType: "CLIENT"
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("Disconnected from socket");
    }
  }
}

export default SocketManager;
