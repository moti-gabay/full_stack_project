import { UserModel } from "../model/user.ts";
import { COOKIE_NAME } from "../routes/auth.ts"
import { verifyToken } from "../utils/utils.ts";

function getToken(req) {
    const fromCookie = req.cookies?.[COOKIE_NAME];
    if (fromCookie) {
        return fromCookie;
    }

    const header = req.get('authorzation');
    if (header?.startWith("Bearer ")) {
        return header.slice(7);
    }
    return null;
}


export async function requireAuth(req, res, next) {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ error: "not logged in" })
    }
    let paylod;
    try {
        paylod =  verifyToken(token);
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