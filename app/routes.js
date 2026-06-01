import { index, route } from "@react-router/dev/routes";

export default [
  // Změněno z "./index.jsx" na "./routes/index.jsx"
  index("./routes/index.jsx"),
  route("events", "./routes/events.jsx"),
  route("events/new", "./routes/new-event.jsx"),
  route("events/:id", "./routes/event-detail.jsx"),
  route("settings", "./routes/settings.jsx"),
];
