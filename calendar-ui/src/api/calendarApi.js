import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Events
export const getEvents = () => api.get('/events').then((res) => res.data);
export const createEvent = (event) => api.post('/events', event).then((res) => res.data);
export const updateEvent = (id, event) => api.put(`/events/${id}`, event).then((res) => res.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Tasks
export const getTasks = () => api.get('/tasks').then((res) => res.data);
export const createTask = (task) => api.post('/tasks', task).then((res) => res.data);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task).then((res) => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Reminders
export const getReminders = () => api.get('/reminders').then((res) => res.data);
export const createReminder = (reminder) => api.post('/reminders', reminder).then((res) => res.data);
export const updateReminder = (id, reminder) =>
  api.put(`/reminders/${id}`, reminder).then((res) => res.data);
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);

export default api;
