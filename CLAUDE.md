# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Google Calendar-like app with two modules:
- `calendar-service` — Spring Boot 3.2 REST API (Java 17, Gradle, H2 in-memory DB)
- `calendar-ui` — React 18 + Vite frontend (FullCalendar, Axios)

## Running the apps

```bash
# Backend (port 8080)
cd calendar-service && ./gradlew bootRun

# Frontend (port 5173)
cd calendar-ui && npm install && npm run dev
```

UI: http://localhost:5173
API: http://localhost:8080/api
H2 console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:calendardb`)

## calendar-service

**Build commands:**
```bash
./gradlew build        # compile + test
./gradlew bootRun      # run dev server
./gradlew test         # run tests only
```

**Package structure:** `com.calendarapp`
- `model/` — JPA entities: `Event`, `Task`, `Reminder`
- `repository/` — Spring Data JPA repositories
- `service/` — CRUD service layer
- `controller/` — REST controllers (`/api/events`, `/api/tasks`, `/api/reminders`)
- `config/CorsConfig.java` — allows `http://localhost:5173`

**Entities:**
- `Event` — title, description, startTime, endTime, location, allDay, color (default `#1a73e8`)
- `Task` — title, description, dueDate, priority (`LOW/MEDIUM/HIGH`), status (`TODO/IN_PROGRESS/DONE`), color (default `#0f9d58`)
- `Reminder` — title, description, reminderTime, triggered, color (default `#f4511e`)

All `LocalDateTime` fields use `@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")`.

## calendar-ui

**Commands:**
```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

**Structure:**
- `src/api/calendarApi.js` — all API calls (axios, base URL `http://localhost:8080/api`)
- `src/components/CalendarView.jsx` — FullCalendar with dayGrid/timeGrid/interaction plugins
- `src/components/Sidebar.jsx` — Create button, today's tasks, upcoming reminders
- `src/components/EventModal.jsx` — unified create/edit modal for all three types
- `src/App.jsx` — root state (events, tasks, reminders, modal open/close)

**Color coding:** Events = blue `#1a73e8`, Tasks = green `#0f9d58`, Reminders = red `#f4511e`

Vite proxies `/api` → `localhost:8080` in dev (configured in `vite.config.js`).
