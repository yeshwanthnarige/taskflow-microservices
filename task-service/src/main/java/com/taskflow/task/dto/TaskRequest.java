package com.taskflow.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskRequest {
    @NotNull
    private Long projectId;
    @NotBlank
    private String title;
    private String description;
    private String status;
    private String assigneeEmail;

    public Long getProjectId() {
        return projectId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getAssigneeEmail() {
        return assigneeEmail;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAssigneeEmail(String assigneeEmail) {
        this.assigneeEmail = assigneeEmail;
    }
}
