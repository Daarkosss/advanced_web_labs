package com.simplechat.backend.controller;

import com.simplechat.backend.model.Message;
import com.simplechat.backend.model.RoomDTO;
import com.simplechat.backend.service.MessageService;
import com.simplechat.backend.socket.SocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SocketService socketService;

    @CrossOrigin
    @GetMapping("/{room}")
    public ResponseEntity<RoomDTO> getMessages(@PathVariable String room) {
        List<Message> messages = messageService.getMessages(room);
        List<String> typingUsers = socketService.getTypingUsersByRoom(room);

        RoomDTO roomDTO = RoomDTO.builder().messages(messages).typingUsers(typingUsers).build();
        return ResponseEntity.ok(roomDTO);
    }


}
