import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";

import "./style/normal.css";

document.body.classList.add(
    localStorage.getItem("juntohyo-theme") ?? "normal"
);

createRoot(document.body).render(<StrictMode>
    <App />
</StrictMode>);
