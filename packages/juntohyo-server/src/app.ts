import { Hono } from "hono";
import type { Env } from "./types";
import { ClientError, ErrorCodes } from "./utils/client_error";
import { rateLimit } from "./middlewares/rate-limit";
import { cors } from "hono/cors";

import { createElectionRoute } from "./routes/create_election";
import { deleteElectionRoute } from "./routes/delete_election";
import { getElectionRoute } from "./routes/get_election";
import { getVotesRoute } from "./routes/get_votes";
import { loginRoute } from "./routes/login";
import { voteRoute } from "./routes/vote";

export const app = new Hono<Env>()
    .use(rateLimit())
    .use(cors({
        origin: process.env.ORIGIN!,
        allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests", "Authorization", "Content-Type"],
        allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 3600,
        credentials: false,
    }))
    .onError((err, c) => {
        if (err instanceof ClientError) {
            return c.json({
                error: err.message,
            }, err.status);
        } else {
            console.error(err);
            return c.json({
                error: ErrorCodes.ServerError,
            }, 500);
        }
    })
    .route("/", createElectionRoute)
    .route("/", deleteElectionRoute)
    .route("/", getElectionRoute)
    .route("/", getVotesRoute)
    .route("/", loginRoute)
    .route("/", voteRoute)
