import type { NextFunction } from "express";


export const validet = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (name.length < 2) {
        console.log(name.length);

        return res.json({ "msg": "name must be more then 2 chars" })
    }
    if (!email.includs("@")) {
        return res.json({ "msg": "email not valid" })
    }

    if (password.length < 8) {
        return res.json({ "msg": "password must be long then 8 chars" })
    }

    next();
}