package com.taskflow.task.service;

import com.taskflow.task.dto.TaskRequest;
import com.taskflow.task.model.Task;
import com.taskflow.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task create(TaskRequest request) {
        Task task = new Task();
        task.setProjectId(request.getProjectId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "TODO" : request.getStatus());
        task.setAssigneeEmail(request.getAssigneeEmail());
        return taskRepository.save(task);
    }

    public Task update(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setProjectId(request.getProjectId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setAssigneeEmail(request.getAssigneeEmail());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
