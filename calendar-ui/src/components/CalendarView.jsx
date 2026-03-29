import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './CalendarView.css';

function CalendarView({ events, tasks, reminders, onDateClick, onEventClick }) {
  const calendarRef = useRef(null);

  const toISOLocal = (dateStr) => {
    if (!dateStr) return null;
    return dateStr;
  };

  const calendarEvents = [
    ...events.map((e) => ({
      id: `event-${e.id}`,
      title: e.title,
      start: toISOLocal(e.startTime),
      end: toISOLocal(e.endTime),
      allDay: e.allDay,
      backgroundColor: e.color || '#1a73e8',
      borderColor: e.color || '#1a73e8',
      textColor: '#fff',
      extendedProps: {
        type: 'event',
        originalId: e.id,
        description: e.description,
        location: e.location,
        color: e.color,
        allDay: e.allDay,
        startTime: e.startTime,
        endTime: e.endTime,
        title: e.title,
        reminderMinutes: e.reminderMinutes,
      },
    })),
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      title: `[Task] ${t.title}`,
      start: toISOLocal(t.dueDate),
      allDay: false,
      backgroundColor: t.color || '#0f9d58',
      borderColor: t.color || '#0f9d58',
      textColor: '#fff',
      extendedProps: {
        type: 'task',
        originalId: t.id,
        description: t.description,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        color: t.color,
        title: t.title,
        reminderMinutes: t.reminderMinutes,
      },
    })),
    ...reminders.map((r) => ({
      id: `reminder-${r.id}`,
      title: `[Reminder] ${r.title}`,
      start: toISOLocal(r.reminderTime),
      allDay: false,
      backgroundColor: r.color || '#f4511e',
      borderColor: r.color || '#f4511e',
      textColor: '#fff',
      extendedProps: {
        type: 'reminder',
        originalId: r.id,
        description: r.description,
        reminderTime: r.reminderTime,
        triggered: r.triggered,
        color: r.color,
        title: r.title,
      },
    })),
  ];

  const handleDateClick = (info) => {
    onDateClick(info.dateStr + 'T00:00:00');
  };

  const handleEventClick = (info) => {
    onEventClick({
      extendedProps: info.event.extendedProps,
    });
  };

  const renderEventContent = (eventInfo) => {
    const { type, reminderMinutes } = eventInfo.event.extendedProps;
    let icon = '';
    if (type === 'task') icon = '✓ ';
    else if (type === 'reminder') icon = '⏰ ';
    const bell = reminderMinutes != null ? ' 🔔' : '';

    return (
      <div className="fc-event-content-custom">
        <span>{icon}{eventInfo.event.title}{bell}</span>
      </div>
    );
  };

  return (
    <div className="calendar-view-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={4}
        weekends={true}
        nowIndicator={true}
        height="100%"
        eventDisplay="block"
      />
    </div>
  );
}

export default CalendarView;
