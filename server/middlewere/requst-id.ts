import { randomUUID } from "node:crypto"

export const requestID = (req, res, next) => {
    req.id = randomUUID();
    res.set('X-Request-ID',req.id);
    next();

}