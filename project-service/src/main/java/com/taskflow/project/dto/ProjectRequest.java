package com.taskflow.project.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String ownerEmail;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
