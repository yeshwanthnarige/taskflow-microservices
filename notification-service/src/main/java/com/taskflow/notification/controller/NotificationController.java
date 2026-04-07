package com.taskflow.notification.controller;

import com.taskflow.notification.dto.NotificationRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    @PostMapping
    public Map<String, String> send(@Valid @RequestBody NotificationRequest request) {
        return Map.of(
                "status", "sent",
                "email", request.getEmail(),
                "message", request.getMessage()
        );
    }
}
