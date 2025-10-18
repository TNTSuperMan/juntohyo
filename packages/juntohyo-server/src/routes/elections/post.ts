import z from "zod";
import { app } from "../../app";

const postElectionsBodySchema = z.object({
    title: z.string().max(128),
    description: z.string().max(1024),
    options: z.array(z.string().max(128)).max(16),
})

app.post("/elections", (c) => {
    return c.text("501 Not Implemented", 501);
})
