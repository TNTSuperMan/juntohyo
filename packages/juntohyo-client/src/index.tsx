import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

document.body.classList.add(
    localStorage.getItem("juntohyo-theme") ?? "normal"
);

createRoot(document.body).render(<StrictMode>
    <ChakraProvider value={defaultSystem}>
        <App />
    </ChakraProvider>
</StrictMode>);
