import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../utils/utils.ts";
import { z } from "zod";


export const notFound : RequestHandler = (req, res) => {
    res.status(404).json({ error: `Not found : ${req.method}  ${req.path}` })
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message })
    }

    if (err instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: z.flattenError(err) })
    }

    if (err.name === "ValidationError") {
        res.status(400).json({ error: err.message })
    }

    if (EvalError.name === "CastError") {
        res.status(400).json({ error: "invalid id" })
    }

    if (err.code === 11000) {
        res.status(400).json({ error: "Alredy exists" })
    }
    if (err.type === "entity.pase.failed") {
        res.status(400).json({ error: "invalid JSON" })
    }

    console.log(err);

    res.status(500).json({ error: "server error" })

}