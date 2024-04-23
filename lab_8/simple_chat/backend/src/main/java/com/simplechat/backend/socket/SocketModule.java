package com.simplechat.backend.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.simplechat.backend.constants.Constants;
import com.simplechat.backend.model.Message;
import com.simplechat.backend.model.TypingDTO;
import com.simplechat.backend.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class SocketModule {

    private final SocketIOServer server;
    private final SocketService socketService;
    private final RoomService roomService;

    public SocketModule(SocketIOServer server, SocketService socketService, RoomService roomService) {
        this.server = server;
        this.socketService = socketService;
        this.roomService = roomService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", Message.class, onChatReceived());
        server.addEventListener("typing", TypingDTO.class, this::onTypingReceived);
    }

    private void onTypingReceived(SocketIOClient client, TypingDTO data, AckRequest ackSender) {
        log.info("Typing received: " + data.getUsername() + " in room: " + data.getRoom() + " is typing? " + data.getIsTyping());
        socketService.handleTyping(client, data);
    }

    private DataListener<Message> onChatReceived() {
        return (senderClient, data, ackSender) -> {
            log.info(data.toString());
            socketService.saveMessage(senderClient, data);
        };
    }


    private ConnectListener onConnected() {
        return (client) -> {
//            String room = client.getHandshakeData().getSingleUrlParam("room");
//            String username = client.getHandshakeData().getSingleUrlParam("room");
            var params = client.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            List<String> usersInRoom = roomService.getUsersInRoom(room);
            client.joinRoom(room);

            if (!usersInRoom.contains(username)) {
                socketService.saveInfoMessage(client, String.format(Constants.WELCOME_MESSAGE, username), room);
                log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to chat module through", client.getSessionId().toString(), room, username);
            } else {
                log.info("User {} already in room {}", username, room);
            }
            roomService.addUserToRoom(room, username);
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            var params = client.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            roomService.removeUserFromRoom(room, username);

            List<String> usersInRoom = roomService.getUsersInRoom(room);

            if (!usersInRoom.contains(username)) {
                log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through", client.getSessionId().toString(), room, username);
                socketService.saveInfoMessage(client, String.format(Constants.DISCONNECT_MESSAGE, username), room);
                socketService.removeTypingUser(room, username);
            }
            log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through", client.getSessionId().toString(), room, username);
        };
    }
}
