import type { Role } from "../schema/user.ts";


export type User = {
    _id: string;
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