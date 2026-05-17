import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import PhytologicWebsite from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PhytologicWebsite />
  </React.StrictMode>
);
