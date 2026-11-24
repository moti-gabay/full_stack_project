import { randomUUID } from "node:crypto"
import {type NextFunction, type Request,type Response} from "express"

export const requestID = (req:Request, res: Response, next:NextFunction) => {
    req.id = randomUUID();
    res.set('X-Request-ID',req.id);
    next();
}