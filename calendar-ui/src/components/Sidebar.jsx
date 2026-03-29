import React from 'react';
import './Sidebar.css';

function Sidebar({ tasks, reminders, onCreateClick }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });

  const now = new Date();
  const upcomingReminders = reminders
    .filter((r) => {
      if (!r.reminderTime) return false;
      return new Date(r.reminderTime) >= now;
    })
    .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime))
    .slice(0, 5);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' ' + d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPriorityClass = (priority) => {
    if (!priority) return '';
    return `priority-${priority.toLowerCase()}`;
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    return `status-${status.toLowerCase().replace('_', '-')}`;
  };

  return (
    <aside className="sidebar">
      <button
        className="create-btn"
        onClick={() => onCreateClick('event')}
        aria-label="Create new item"
      >
        <span className="create-btn-icon">+</span>
        <span className="create-btn-text">Create</span>
      </button>

      <div className="sidebar-section">
        <div className="sidebar-section-header">Quick Create</div>
        <div className="quick-create-buttons">
          <button
            className="quick-create-item event-btn"
            onClick={() => onCreateClick('event')}
          >
            <span className="quick-dot" style={{ backgroundColor: '#1a73e8' }}></span>
            Event
          </button>
          <button
            className="quick-create-item task-btn"
            onClick={() => onCreateClick('task')}
          >
            <span className="quick-dot" style={{ backgroundColor: '#0f9d58' }}></span>
            Task
          </button>
          <button
            className="quick-create-item reminder-btn"
            onClick={() => onCreateClick('reminder')}
          >
            <span className="quick-dot" style={{ backgroundColor: '#f4511e' }}></span>
            Reminder
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          Today's Tasks
          <span className="badge">{todayTasks.length}</span>
        </div>
        {todayTasks.length === 0 ? (
          <p className="sidebar-empty">No tasks due today</p>
        ) : (
          <ul className="sidebar-list">
            {todayTasks.map((task) => (
              <li key={task.id} className="sidebar-list-item">
                <div
                  className="item-color-dot"
                  style={{ backgroundColor: task.color || '#0f9d58' }}
                ></div>
                <div className="item-details">
                  <span className="item-title">{task.title}</span>
                  <div className="item-meta">
                    {task.dueDate && (
                      <span className="item-time">{formatTime(task.dueDate)}</span>
                    )}
                    <span className={`item-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`item-badge ${getStatusClass(task.status)}`}>
                      {task.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          Upcoming Reminders
          <span className="badge">{upcomingReminders.length}</span>
        </div>
        {upcomingReminders.length === 0 ? (
          <p className="sidebar-empty">No upcoming reminders</p>
        ) : (
          <ul className="sidebar-list">
            {upcomingReminders.map((reminder) => (
              <li key={reminder.id} className="sidebar-list-item">
                <div
                  className="item-color-dot"
                  style={{ backgroundColor: reminder.color || '#f4511e' }}
                ></div>
                <div className="item-details">
                  <span className="item-title">{reminder.title}</span>
                  {reminder.reminderTime && (
                    <span className="item-time">{formatDateTime(reminder.reminderTime)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
