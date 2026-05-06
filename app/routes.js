import { index, route } from "@react-router/dev/routes";

export default [
  // Cesta: / (Index, Domů - seznam událostí)
  index("./index.jsx"),
  
  // Cesta: /events/new (Přidat událost)
  route("events/new", "./new-event.jsx"),

  // Cesta: /events/:id (Detail události, :id je dynamický parametr)
  route("events/:id", "./event-detail.jsx")
];