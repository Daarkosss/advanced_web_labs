import React from "react";
import { timeStampConverter } from "../../util/timeUtils";
import { store } from "../../store/store";
import "../../scss/main.scss";

export const MessageItem = ({ message }) => {
  const type = message.messageType.toLowerCase();
  const self = message.username === store.username ? "_self" : "";
  const time = timeStampConverter(message.createdDateTime);

  return (
    <div className={"message_item_" + type + self}>
      {type !== "server" && self === "" && (
        <span className="message_item_username">{message.username}</span>
      )}
      <div className={"message_content_" + type + self}>
        <span className="message_content_value">{message.content}</span>
        <span>{time}</span>
      </div>
    </div>
  );
};
