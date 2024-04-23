import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import SocketManager from "../api/SocketManager";

class Store {
  username = "";
  room = "";
  messages = [];
  typingUsers = [];

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.username;
  }

  logout() {
    if (api.socketManager) {
      api.socketManager.disconnect();
      api.socketManager = null;
    }
    this.username = "";
    this.room = "";
    this.messages = [];
    this.typingUsers = [];
  }

  connectWithSocket() {
    api.socketManager = new SocketManager(this);
  }

  disconnectWithSocket() {
    api.socketManager = null;
  }

  async getRoomMessages() {
    try {
      const response = await api.getRoomMessages(this.room);
      const allMessages = response.messages;
      for (let i = 0; i < allMessages.length; i++) {
        this.addMessage(allMessages[i]);
      }
      console.log("messages", this.messages);
      this.typingUsers = response.typingUsers;
    } catch (e) {
      console.error(e);
    }
  }

  addMessage(message) {
    // if first message word != this.username
    console.log("message", message);
    if (typeof message !== "string") {
      const firstWord = message.content.split(" ")[0];
      if (firstWord !== this.username || message.messageType === "CLIENT") {
        this.messages.push(message);
      }
    } else {
      this.messages.push(message);
    }
  }

  addTypingUser(username) {
    if (!this.typingUsers.includes(username)) {
      this.typingUsers.push(username);
    }
    console.log(this.typingUsers);
  }

  removeTypingUser(username) {
    this.typingUsers = this.typingUsers.filter((user) => user !== username);
  }

  sendMessage(content, username, room) {
    api.socketManager.sendData({ content, username, room });
  }

  sendTypingSignal(isTyping) {
    api.socketManager.sendTypingSignal(isTyping);
  }
}

export const store = new Store();
