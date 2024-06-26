package com.simplechat.backend.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.simplechat.backend.model.Message;
import com.simplechat.backend.model.MessageType;
import com.simplechat.backend.model.TypingDTO;
import com.simplechat.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {

    private final MessageService messageService;
    private ConcurrentHashMap<String, List<String>> typingUsers = new ConcurrentHashMap<>();

    public List<String> getTypingUsersByRoom(String room) {
        return typingUsers.getOrDefault(room, new ArrayList<>());
    }

    public void handleTyping(SocketIOClient senderClient, TypingDTO data) {
        typingUsers.computeIfAbsent(data.getRoom(), k -> new ArrayList<>());
        List<String> users = typingUsers.get(data.getRoom());
        if (data.getIsTyping()) {
            if (!users.contains(data.getUsername())) {
                users.add(data.getUsername());
            }
        } else {
            users.remove(data.getUsername());
        }
        sendTypingStatus(senderClient, data.getRoom(), data.getUsername(), data.getIsTyping());
    }

    public void removeTypingUser(String room, String username) {
        List<String> users = typingUsers.get(room);
        if (users != null) {
            users.remove(username);
        }
    }

    private void sendTypingStatus(SocketIOClient senderClient, String room, String username, boolean isTyping) {
        log.info(senderClient.getNamespace().getRoomOperations(room).getClients().toString());
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("typing", username, isTyping);
            }
        }
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
