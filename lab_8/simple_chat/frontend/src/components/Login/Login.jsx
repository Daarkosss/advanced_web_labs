import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../store/store";
import "../../scss/main.scss";

export const Login = observer (() => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const checkForLogin = (e) => {
    e.preventDefault();
    if (room === "" || username === "") {
      alert("fill the required fields");
    } else {
      store.room = room;
      store.username = username;
    }
  };

  return (
    <div className="login_root">
      <form className="login_form" onSubmit={checkForLogin}>
        <input
          type="text"
          required
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
});
