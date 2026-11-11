import { Router, type Request, type Response } from "express";
import { TaskModel } from "../model/task.ts";
import { requireAuth } from "../middlewere/requireAuth.ts";

export const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.get("/", async (req: Request, res: Response) => {
    try {
        const tasks = await TaskModel.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err: any) {
        throw new Error(err)
    }
});

taskRouter.post("/", async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) {
        return res.send(" title is required")
    }
    if (!req?.user?._id) {
        return res.json({ error: "login befor " })
    }
    const task = await TaskModel.create({ title, done: false, userId: req?.user._id });
    if (!task) {
        return res.json({ "msg": "server error" })
    }
    return res.json({ "id": task.id })
});

taskRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user } = req;
    const { title, done } = req.body;
    const task = await TaskModel.findById({ _id: id });
    if (!task) {
        return res.status(404).json({ error: "task not found" })
    }
    if (!user) {
        return res.json({ error: "user not found" })
    }
    if (!task.userId.equals(user._id)) {
        return res.json({ error: "not your task" })
    }
    const updateTask = await TaskModel.updateOne({ _id: id }, { title, done })
    return res.status(200).json({ "msg": "task is updated !", updateTask })
})

taskRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        return res.json({ error: "user not found" })
    }
    const task = await TaskModel.findById({ _id: id });
    if (!task) {
        return res.status(404).json({ error: "task not found" })
    }
    if (!task.userId.equals(user._id)) {
        return res.json({ error: "not your task" })
    }
    const deletedTasks = await TaskModel.findByIdAndDelete({ _id: id })
    return res.status(200).json({ "msg": "task deleted !", deletedTasks });
})









