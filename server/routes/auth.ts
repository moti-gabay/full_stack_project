import { Router, type Request, type Response } from "express";
import type { User } from "../types/types.ts";
import { UserModel } from "../model/user.ts";
import { signToken, verifyToken } from "../utils/utils.ts";
import { hash, compare } from "bcrypt"
import { requireAuth } from "../middlewere/requireAuth.ts";
import { loginSchema, registerSchema } from "../schema/user.ts";

export const authRouter = Router();
export const COOKIE_NAME = 'token'

authRouter.post("/register", async (req: Request, res: Response) => {
        const { name, email, password } = registerSchema.parse(req.body);
        const hashPassword = await hash(password, 10);
        const user = await UserModel.create({ name, email, password: hashPassword, role: "user" });
        return res.status(201).json({ id: user._id, email: user.email });   
});

authRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email });
    if (!user || !(await compare(password, user.password!))) {
        return res.status(401).json({ "msg": "invalid credentials" })
    }
    const token = await signToken(user as unknown as User);
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    return res.json({ "ok": true })
});

authRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401)
    }
        const {_id,name,email,role} = req.user!
        return res.status(200).json({ user: {id:_id.toString(),name,email,role} });
})

authRouter.post("/logout", requireAuth, (req, res) => {
    res.clearCookie('token');
    return res.sendStatus(204);
});

