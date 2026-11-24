import type { Role } from "../schema/user.ts";
import type { Types } from "mongoose"

export type User = {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role
}

export type Task = {
    title: string;
    done: boolean;
    userId: string
}