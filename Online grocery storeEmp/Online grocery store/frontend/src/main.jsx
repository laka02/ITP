import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Ensure correct import
import App from "./App"; // Ensure App.js exists in the same directory
import "./index.css"; // Use your index.css file which exists

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found! Check your index.html file.");
}
