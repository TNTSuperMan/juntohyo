import type { Hook } from "@hono/typia-validator";
import type { Env } from "../types";
import { ClientError, ErrorCodes } from "./client_error";

export const handleValidation: Hook<
    unknown, Env, string
> = (res, _c) => {
    if (!res.success) {
        throw new ClientError(ErrorCodes.BadRequest);
    }
}
