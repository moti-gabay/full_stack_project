import { Router, type Request, type Response } from "express";
import { UserModel } from "../model/user.ts";
import { idParams } from "../schema/commn.ts";
import { changeRoleSchema } from "../schema/user.ts";
import { currntUser } from "../middlewere/requireAuth.ts";
import { HttpError } from "../utils/utils.ts";
import { TaskModel } from "../model/task.ts";
import { adminListQuerySchema } from "../schema/task.ts";
import { hash, compare } from "bcrypt"

export const adminRouter = Router();

adminRouter.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({});
        res.json(users)
    } catch (err: any) {
        throw new Error(err)
    }
});

adminRouter.post("/users", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.send("name and email and password is required");
        }
        const hashPassword = await hash(password, 10);
        const user = await UserModel.create({ name, email, password: hashPassword, role: "user" });
        return res.status(201).json({ id: user._id, email: user.email });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({ "msg": "email already exists" })
        }
        return res.status(500).json({ "msg": "server error" })
    }
});

adminRouter.put("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = UserModel.findByIdAndUpdate({ _id: id }, { name, email });
    return res.status(200).json({ "msg": "user is updated !", user })
});

adminRouter.delete("/users/:id", async (req, res) => {
    const { id } = idParams.parse(req.params);
    if (currntUser(req)._id.equals(id)) {
        throw new HttpError(409, "You can't delete yourself")
    }
    const user = await UserModel.findByIdAndDelete({ _id: id });
    await TaskModel.deleteMany({ userId: id });
    return res.status(204).json({ "msg": "user deleted !" })
});

adminRouter.patch("/users/:id/role", async (req, res) => {
    const { id } = idParams.parse(req.params);
    const { role } = changeRoleSchema.parse(req.body);
    if (currntUser(req)._id.equals(id)) {
        throw new HttpError(409, "You can't change your role")
    }
    const user = await UserModel.findByIdAndUpdate(id, { role }, { returnDocument: "after", runValidators: true });

    if (!user) {
        throw new HttpError(404, "User not found");
    }
    res.json(user)
});

adminRouter.get("/tasks", async (req, res) => {
    const { userId, done } = adminListQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};
    if (userId) {
        filter.userId = userId;
    }
    if (done) {
        filter.done = done
    }
    res.json(await TaskModel.find(filter).sort({ createdAt: -1 }).populate("userId", "name email"))
})

adminRouter.delete("/tasks/:id", async (req, res) => {
    const { id } = idParams.parse(req.params);
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
        throw new HttpError(404, "Task not found")
    }
    res.status(204).json({ "msg": "all task is deleted" })
})