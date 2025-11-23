import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";
import { CreateElection } from "./pages/create-election";

export function Router() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-election" element={<CreateElection />} />
        </Routes>
    </BrowserRouter>
}
