package com.simplechat.backend.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.simplechat.backend.model.Message;
import com.simplechat.backend.model.MessageType;
import com.simplechat.backend.model.TypingData;
import com.simplechat.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {

    private final MessageService messageService;
    private ConcurrentHashMap<String, String> typingUsers = new ConcurrentHashMap<>();

    public void handleTyping(SocketIOClient senderClient, TypingData data) {
        String username = data.getUsername();
        String room = data.getRoom();
        boolean isTyping = data.isTyping();

        if (data.isTyping()) {
            typingUsers.put(room, username);
        } else {
            typingUsers.remove(room, username);
        }
        sendTypingStatus(senderClient, room, username, isTyping);
    }

    private void sendTypingStatus(SocketIOClient senderClient, String room, String username, boolean isTyping) {
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("typing", username, isTyping);
            }
        };
    }

    public void sendSocketMessage(SocketIOClient senderClient, Message message, String room) {
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("read_message", message);
            }
        }
    }

    public void saveMessage(SocketIOClient senderClient, Message message) {
        Message storedMessage = messageService.saveMessage(Message.builder()
                .messageType(MessageType.CLIENT)
                .content(message.getContent())
                .room(message.getRoom())
                .username(message.getUsername())
                .build());
        sendSocketMessage(senderClient, storedMessage, message.getRoom());
    }

    public void saveInfoMessage(SocketIOClient senderClient, String message, String room) {
        Message storedMessage = messageService.saveMessage(Message.builder()
                .messageType(MessageType.SERVER)
                .content(message)
                .room(room)
                .build());
        sendSocketMessage(senderClient, storedMessage, room);
    }
}
