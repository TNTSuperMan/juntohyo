import { Hono } from "hono";
import type { Env } from "./types";

export const app = new Hono<Env>();
