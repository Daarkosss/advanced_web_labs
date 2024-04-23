package com.simplechat.backend.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {
    private Map<String, List<String>> roomUserMap = new ConcurrentHashMap<>();

    public List<String> getUsersInRoom(String room) {
        return roomUserMap.computeIfAbsent(room, k -> new ArrayList<>());
    }

    public void addUserToRoom(String room, String username) {
        getUsersInRoom(room).add(username);
    }

    public void removeUserFromRoom(String room, String username) {
        List<String> users = getUsersInRoom(room);
        users.remove(username);
        if (users.isEmpty()) {
            roomUserMap.remove(room);
        }
    }

    public Map<String, List<String>> getRoomUserMap() {
        return roomUserMap;
    }
}