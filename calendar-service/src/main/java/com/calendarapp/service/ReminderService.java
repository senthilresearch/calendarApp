package com.calendarapp.service;

import com.calendarapp.model.Reminder;
import com.calendarapp.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public ReminderService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public Reminder getReminderById(Long id) {
        return reminderRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    public Reminder createReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(Long id, Reminder updatedReminder) {
        Reminder existing = reminderRepository.findById(id).orElseThrow(RuntimeException::new);
        existing.setTitle(updatedReminder.getTitle());
        existing.setDescription(updatedReminder.getDescription());
        existing.setReminderTime(updatedReminder.getReminderTime());
        existing.setTriggered(updatedReminder.isTriggered());
        existing.setColor(updatedReminder.getColor());
        return reminderRepository.save(existing);
    }

    public void deleteReminder(Long id) {
        reminderRepository.findById(id).orElseThrow(RuntimeException::new);
        reminderRepository.deleteById(id);
    }
}
