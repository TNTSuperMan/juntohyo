import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";

createRoot(document.body).render(<StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
        </Routes>
    </BrowserRouter>
</StrictMode>);
