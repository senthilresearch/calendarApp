package com.calendarapp.service;

import com.calendarapp.model.Task;
import com.calendarapp.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existing = taskRepository.findById(id).orElseThrow(RuntimeException::new);
        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setPriority(updatedTask.getPriority());
        existing.setStatus(updatedTask.getStatus());
        existing.setColor(updatedTask.getColor());
        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {
        taskRepository.findById(id).orElseThrow(RuntimeException::new);
        taskRepository.deleteById(id);
    }
}
