package com.simplechat.backend.model;

import lombok.Data;
import lombok.Getter;

@Data
public class TypingData {
    @Getter
    private String username;

    @Getter
    private String room;

    private boolean isTyping;

    public boolean isTyping() {
        return this.isTyping;
    }
}
