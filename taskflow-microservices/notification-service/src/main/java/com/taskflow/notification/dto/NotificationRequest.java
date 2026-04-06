package com.taskflow.notification.dto;

import jakarta.validation.constraints.NotBlank;

public class NotificationRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String message;

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
