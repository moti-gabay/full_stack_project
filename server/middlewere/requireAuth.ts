import { type Request, type Response, type NextFunction, type RequestHandler } from "express"
import { UserModel } from "../model/user.ts";
import { COOKIE_NAME } from "../routes/auth.ts"
import { verifyToken } from "../utils/utils.ts";
import type { User } from "../types/types.ts";
import type { Role } from "../schema/user.ts";

function getToken(req: Request) {
    const fromCookie = req.cookies?.[COOKIE_NAME];
    if (fromCookie) {
        return fromCookie;
    }
   
    const header = req.get('authorzation');
    if (header?.startsWith("Bearer ")) {
        return header.slice(7);
    }
    return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ error: "not logged in" })
    }
    let paylod;
    try {
        paylod = verifyToken(token);
    } catch (error) {

        const code = error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";

        return res.status(401).json({ error: "invalide or expierd token", code })
    }
    const { userId } = paylod;
    let user;
    if (userId) {
        user = await UserModel.findById(userId);
    }
    if (!user) {
        return res.status(401).json({ error: "invalide token" })
    }
    req.user = user;
    next();
}

export function requireRole(...allowed: Role[]): RequestHandler {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            next(new Error("requirdRole() use without requirdAuth"))
            return;
        }
        if (!allowed.includes(user.role)) {
            res.status(403).json({ error: "Forbidden" })
            return;
        }
        next();
    }

}

export function currntUser(req: Request): User {
    if (!req.user) {
        throw new Error("currntuser() called without requireAuth")
    }
    return req.user;
}