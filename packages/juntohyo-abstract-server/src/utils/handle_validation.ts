import type { Hook } from "@hono/typia-validator";
import type { Env } from "../types";
import { error, ErrorCodes } from "./error";

export const handleValidation: Hook<
    unknown, Env, string
> = (res, c) => {
    if (!res.success) {
        return error(c, ErrorCodes.BadRequest);
    }
}
