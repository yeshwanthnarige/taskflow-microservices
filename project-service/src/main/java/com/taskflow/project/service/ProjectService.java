package com.taskflow.project.service;

import com.taskflow.project.dto.ProjectRequest;
import com.taskflow.project.model.Project;
import com.taskflow.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAll(String ownerEmail) {
        if (ownerEmail != null && !ownerEmail.isBlank()) {
            return projectRepository.findByOwnerEmail(ownerEmail);
        }
        return projectRepository.findAll();
    }

    public Project create(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwnerEmail(request.getOwnerEmail());
        return projectRepository.save(project);
    }

    public Project update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwnerEmail(request.getOwnerEmail());
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
