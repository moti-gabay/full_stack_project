import { Router, type Request, type Response } from "express";
import type { User } from "../types/types.ts";
import { UserModel } from "../model/user.ts";

export const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({});
        res.json(users)
    } catch (err: any) {
        throw new Error(err)
    }
});

// userRouter.post("/", (req: Request, res: Response) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//         return res.send("name and email is required")
//     }
//     const newUser: User = {
//         id: uuid(),
//         name,
//         email
//     }
//     users.push(newUser);

//     return res.json(newUser)
// });


userRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = UserModel.findByIdAndUpdate({ _id: id }, { name, email });
    return res.status(200).json({ "msg": "user is updated !", user })
})


userRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({ "msg": "user deleted !", user })

})









