import React, { useState, useEffect } from 'react';
import './EventModal.css';

const DEFAULT_COLORS = {
  event: '#1a73e8',
  task: '#0f9d58',
  reminder: '#f4511e',
};

function EventModal({ isOpen, onClose, item, defaultDate, defaultType, onSave, onDelete }) {
  const [type, setType] = useState(defaultType || 'event');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[defaultType || 'event']);

  // Event fields
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [eventReminderMinutes, setEventReminderMinutes] = useState('');

  // Task fields
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [taskReminderMinutes, setTaskReminderMinutes] = useState('');

  // Reminder fields
  const [reminderTime, setReminderTime] = useState('');
  const [triggered, setTriggered] = useState(false);

  const isEditing = item !== null && item !== undefined;
  const originalId = item?.extendedProps?.originalId;
  const itemType = item?.extendedProps?.type;

  const toInputDateTime = (str) => {
    if (!str) return '';
    return str.slice(0, 16);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && item) {
      const props = item.extendedProps;
      const t = props.type || 'event';
      setType(t);
      setTitle(props.title || '');
      setDescription(props.description || '');
      setColor(props.color || DEFAULT_COLORS[t]);

      if (t === 'event') {
        setStartTime(toInputDateTime(props.startTime));
        setEndTime(toInputDateTime(props.endTime));
        setLocation(props.location || '');
        setAllDay(props.allDay || false);
        setEventReminderMinutes(props.reminderMinutes != null ? String(props.reminderMinutes) : '');
      } else if (t === 'task') {
        setDueDate(toInputDateTime(props.dueDate));
        setPriority(props.priority || 'MEDIUM');
        setStatus(props.status || 'TODO');
        setTaskReminderMinutes(props.reminderMinutes != null ? String(props.reminderMinutes) : '');
      } else if (t === 'reminder') {
        setReminderTime(toInputDateTime(props.reminderTime));
        setTriggered(props.triggered || false);
      }
    } else {
      const t = defaultType || 'event';
      setType(t);
      setTitle('');
      setDescription('');
      setColor(DEFAULT_COLORS[t]);
      setStartTime(defaultDate ? toInputDateTime(defaultDate) : '');
      setEndTime(defaultDate ? toInputDateTime(defaultDate) : '');
      setLocation('');
      setAllDay(false);
      setEventReminderMinutes('');
      setDueDate(defaultDate ? toInputDateTime(defaultDate) : '');
      setPriority('MEDIUM');
      setStatus('TODO');
      setTaskReminderMinutes('');
      setReminderTime(defaultDate ? toInputDateTime(defaultDate) : '');
      setTriggered(false);
    }
  }, [isOpen, item, defaultDate, defaultType, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setColor(DEFAULT_COLORS[type] || '#1a73e8');
    }
  }, [type, isEditing]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const toISOString = (val) => {
    if (!val) return null;
    return val + ':00';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let data = {};
    if (type === 'event') {
      data = {
        title,
        description,
        startTime: toISOString(startTime),
        endTime: toISOString(endTime),
        color,
        location,
        allDay,
        reminderMinutes: eventReminderMinutes !== '' ? parseInt(eventReminderMinutes) : null,
      };
    } else if (type === 'task') {
      data = {
        title,
        description,
        dueDate: toISOString(dueDate),
        priority,
        status,
        color,
        reminderMinutes: taskReminderMinutes !== '' ? parseInt(taskReminderMinutes) : null,
      };
    } else if (type === 'reminder') {
      data = {
        title,
        description,
        reminderTime: toISOString(reminderTime),
        triggered,
        color,
      };
    }

    onSave(type, data, isEditing ? originalId : null);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete this ${itemType}?`)) {
      onDelete(itemType, originalId);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? `Edit ${itemType?.charAt(0).toUpperCase() + itemType?.slice(1)}` : 'Create New'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {!isEditing && (
          <div className="type-selector">
            <button
              className={`type-btn ${type === 'event' ? 'active event-active' : ''}`}
              onClick={() => handleTypeChange('event')}
              type="button"
            >
              Event
            </button>
            <button
              className={`type-btn ${type === 'task' ? 'active task-active' : ''}`}
              onClick={() => handleTypeChange('task')}
              type="button"
            >
              Task
            </button>
            <button
              className={`type-btn ${type === 'reminder' ? 'active reminder-active' : ''}`}
              onClick={() => handleTypeChange('reminder')}
              type="button"
            >
              Reminder
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              className="form-title-input"
              placeholder={`Add ${type} title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Event-specific fields */}
          {type === 'event' && (
            <>
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="form-group form-group-flex">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="location-input-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  {location.trim() && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="maps-link-btn"
                      title="Open in Google Maps"
                    >
                      📍 Maps
                    </a>
                  )}
                </div>
              </div>
              <div className="form-group form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={(e) => setAllDay(e.target.checked)}
                  />
                  All Day
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">🔔 Remind me</label>
                <select
                  className="form-select"
                  value={eventReminderMinutes}
                  onChange={(e) => setEventReminderMinutes(e.target.value)}
                >
                  <option value="">No reminder</option>
                  <option value="0">At time of event</option>
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                  <option value="2880">2 days before</option>
                </select>
              </div>
            </>
          )}

          {/* Task-specific fields */}
          {type === 'task' && (
            <>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🔔 Remind me</label>
                <select
                  className="form-select"
                  value={taskReminderMinutes}
                  onChange={(e) => setTaskReminderMinutes(e.target.value)}
                >
                  <option value="">No reminder</option>
                  <option value="0">At due time</option>
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                  <option value="2880">2 days before</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group form-group-flex">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Reminder-specific fields */}
          {type === 'reminder' && (
            <>
              <div className="form-group">
                <label className="form-label">Reminder Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              {isEditing && (
                <div className="form-group form-group-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={triggered}
                      onChange={(e) => setTriggered(e.target.checked)}
                    />
                    Triggered
                  </label>
                </div>
              )}
            </>
          )}

          {/* Color picker */}
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <div className="color-presets">
                {type === 'event' && (
                  <>
                    <button type="button" className="color-preset" style={{ backgroundColor: '#1a73e8' }} onClick={() => setColor('#1a73e8')} title="Google Blue" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#d50000' }} onClick={() => setColor('#d50000')} title="Red" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#e67c73' }} onClick={() => setColor('#e67c73')} title="Flamingo" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#f6c026' }} onClick={() => setColor('#f6c026')} title="Banana" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#33b679' }} onClick={() => setColor('#33b679')} title="Sage" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#8e24aa' }} onClick={() => setColor('#8e24aa')} title="Grape" />
                  </>
                )}
                {type === 'task' && (
                  <>
                    <button type="button" className="color-preset" style={{ backgroundColor: '#0f9d58' }} onClick={() => setColor('#0f9d58')} title="Green" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#33b679' }} onClick={() => setColor('#33b679')} title="Sage" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#1a73e8' }} onClick={() => setColor('#1a73e8')} title="Blue" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#f6c026' }} onClick={() => setColor('#f6c026')} title="Yellow" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#8e24aa' }} onClick={() => setColor('#8e24aa')} title="Purple" />
                  </>
                )}
                {type === 'reminder' && (
                  <>
                    <button type="button" className="color-preset" style={{ backgroundColor: '#f4511e' }} onClick={() => setColor('#f4511e')} title="Orange" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#d50000' }} onClick={() => setColor('#d50000')} title="Red" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#e67c73' }} onClick={() => setColor('#e67c73')} title="Flamingo" />
                    <button type="button" className="color-preset" style={{ backgroundColor: '#f6c026' }} onClick={() => setColor('#f6c026')} title="Yellow" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="btn btn-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <div className="modal-footer-right">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-save">
                {isEditing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
