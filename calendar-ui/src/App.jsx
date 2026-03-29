import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarView from './components/CalendarView.jsx';
import Sidebar from './components/Sidebar.jsx';
import EventModal from './components/EventModal.jsx';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from './api/calendarApi.js';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [defaultType, setDefaultType] = useState('event');
  const notificationTimers = useRef([]);

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scheduleNotifications = useCallback((eventsData, tasksData) => {
    // Clear previous timers
    notificationTimers.current.forEach(clearTimeout);
    notificationTimers.current = [];

    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = Date.now();

    eventsData.forEach((e) => {
      if (e.reminderMinutes == null || !e.startTime) return;
      const fireAt = new Date(e.startTime).getTime() - e.reminderMinutes * 60 * 1000;
      const delay = fireAt - now;
      if (delay > 0) {
        const t = setTimeout(() => {
          new Notification(`Reminder: ${e.title}`, {
            body: e.reminderMinutes === 0
              ? 'Your event is starting now.'
              : `Starting in ${e.reminderMinutes} minute${e.reminderMinutes !== 1 ? 's' : ''}.`,
            icon: '/favicon.ico',
          });
        }, delay);
        notificationTimers.current.push(t);
      }
    });

    tasksData.forEach((t) => {
      if (t.reminderMinutes == null || !t.dueDate) return;
      const fireAt = new Date(t.dueDate).getTime() - t.reminderMinutes * 60 * 1000;
      const delay = fireAt - now;
      if (delay > 0) {
        const timer = setTimeout(() => {
          new Notification(`Task due: ${t.title}`, {
            body: t.reminderMinutes === 0
              ? 'This task is due now.'
              : `Due in ${t.reminderMinutes} minute${t.reminderMinutes !== 1 ? 's' : ''}.`,
            icon: '/favicon.ico',
          });
        }, delay);
        notificationTimers.current.push(timer);
      }
    });
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [eventsData, tasksData, remindersData] = await Promise.all([
        getEvents(),
        getTasks(),
        getReminders(),
      ]);
      setEvents(eventsData);
      setTasks(tasksData);
      setReminders(remindersData);
      scheduleNotifications(eventsData, tasksData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }, [scheduleNotifications]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleOpenCreate = (date, type = 'event') => {
    setSelectedItem(null);
    setSelectedDate(date || new Date().toISOString().slice(0, 16));
    setDefaultType(type);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setSelectedDate(null);
    setDefaultType(item.extendedProps?.type || 'event');
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setSelectedDate(null);
  };

  const handleSave = async (type, data, id) => {
    try {
      if (id) {
        if (type === 'event') await updateEvent(id, data);
        else if (type === 'task') await updateTask(id, data);
        else await updateReminder(id, data);
      } else {
        if (type === 'event') await createEvent(data);
        else if (type === 'task') await createTask(data);
        else await createReminder(data);
      }
      await loadAll();
      handleClose();
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'event') await deleteEvent(id);
      else if (type === 'task') await deleteTask(id);
      else await deleteReminder(id);
      await loadAll();
      handleClose();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <button className="hamburger-btn" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="app-logo">
            <span className="logo-icon">31</span>
            <span className="logo-text">Calendar</span>
          </div>
        </div>
        <div className="header-center">
          <span className="header-date">
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="header-right">
          <div className="user-avatar" aria-label="User account">A</div>
        </div>
      </header>

      <div className="app-body">
        <Sidebar
          tasks={tasks}
          reminders={reminders}
          onCreateClick={(type) => handleOpenCreate(null, type)}
        />
        <main className="calendar-main">
          <CalendarView
            events={events}
            tasks={tasks}
            reminders={reminders}
            onDateClick={(date) => handleOpenCreate(date, 'event')}
            onEventClick={handleOpenEdit}
          />
        </main>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={handleClose}
        item={selectedItem}
        defaultDate={selectedDate}
        defaultType={defaultType}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
