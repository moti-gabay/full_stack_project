
import { z } from "zod";
import { objectId } from "./commn.ts";


const title = z.string().trim().min(2, "Title is required");

export const createTaskSchema = z.object({ title });


export const updateTaskSchema = z.
    object({ title, done: z.boolean() })
    .partial().
    refine((data) => Object.keys(data).length > 0, { error: "Nothing to update" });

const done = z.enum(["true", "false"]).optional().transform((v) => (v === undefined ? undefined : v === "true"));

export const listQuirySchema = z.object({ done });


export const adminListQuerySchema = z.object({ userId: objectId.optional(), done })
