import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";

export function Router() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
        </Routes>
    </BrowserRouter>
}
