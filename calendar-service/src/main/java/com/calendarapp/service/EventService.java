package com.calendarapp.service;

import com.calendarapp.model.Event;
import com.calendarapp.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Event existing = eventRepository.findById(id).orElseThrow(RuntimeException::new);
        existing.setTitle(updatedEvent.getTitle());
        existing.setDescription(updatedEvent.getDescription());
        existing.setStartTime(updatedEvent.getStartTime());
        existing.setEndTime(updatedEvent.getEndTime());
        existing.setColor(updatedEvent.getColor());
        existing.setLocation(updatedEvent.getLocation());
        existing.setAllDay(updatedEvent.isAllDay());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        eventRepository.findById(id).orElseThrow(RuntimeException::new);
        eventRepository.deleteById(id);
    }
}
