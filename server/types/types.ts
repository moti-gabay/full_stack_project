export type User = {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export type Task = {
    title: string;
    done: boolean;
    userId: string
}