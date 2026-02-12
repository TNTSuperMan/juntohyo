import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";
import { CreateElection } from "./pages/create-election";
import { Vote } from "./pages/vote";

export function Router() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-election" element={<CreateElection />} />
            <Route path="/vote/:id" element={<Vote />} />
        </Routes>
    </BrowserRouter>
}
