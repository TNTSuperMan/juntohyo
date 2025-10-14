import { app } from "../../app";

app.post("/elections", (c) => {
    return c.text("501 Not Implemented", 501);
})
