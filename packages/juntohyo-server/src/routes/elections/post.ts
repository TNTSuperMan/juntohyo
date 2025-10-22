import typia from "typia";
import { app } from "../../app";
import { typiaValidator } from "@hono/typia-validator";

interface Option {
    /**
     * @maxLength 128
     */
    name: string;
}

interface PostElectionsBody {
    /**
     * @maxLength 128
     */
    title: string;
    /**
     * @maxLength 1024
     */
    description: string;
    /**
     * @maxItems 16
     */
    options: Option[];
}

const postElectionsBodyValidator = typia.createValidate<PostElectionsBody>();

app.post("/elections",
    typiaValidator("json", postElectionsBodyValidator),
    (c) => {
        return c.text("501 Not Implemented", 501);
    }
);
