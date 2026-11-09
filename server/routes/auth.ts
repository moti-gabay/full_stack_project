import { Router, type Request, type Response } from "express";
import type { User } from "../types/types.ts";
import { UserModel } from "../model/user.ts";
import { signToken, verifyToken } from "../utils/utils.ts";
import { hash, compare } from "bcrypt"


export const authRouter = Router();


authRouter.post("/register", async (req: Request, res: Response) => {
    try {
        
        const { name, email, password } = req.body;
        if (!name || !email) {
            return res.send("name and email is required")
        }
        const hashPassword = await hash(password, 10);
        const user = await UserModel.create({ name, email,password:hashPassword, role: "user" });
        return res.status(201).json({ id: user._id, email: user.email })
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({ "msg": "email already exists" })
        }
        return res.status(500).json({ "msg": "server error" })
    }
});


authRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ "msg": "email and password is required" })
    }
    const user = await UserModel.findOne({ email });
    if (!user || !(await compare(password, user.password!))) {
        return res.status(401).json({ "msg": "invalid credentials" })
    }

    const token = await signToken(user as unknown as User);
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    return res.json({ "ok": true })

});

authRouter.get("/me", async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401)
    }
    try {
        const jwtPayload = await verifyToken(token)
        return res.json({ userId: jwtPayload });

    } catch {
        return res.sendStatus(401)
    }

})

authRouter.post("/logout", (req, res) => {
    res.clearCookie('token');
    return res.sendStatus(204);
});

