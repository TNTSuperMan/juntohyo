import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";

import "./style/normal.css";

document.body.classList.add(
    localStorage.getItem("juntohyo-theme") ?? "normal"
);

createRoot(document.body).render(<StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
        </Routes>
    </BrowserRouter>
</StrictMode>);
