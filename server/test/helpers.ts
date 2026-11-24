import request from "supertest";
import { app } from "../app.ts";
import { UserModel } from "../model/user.ts";



export async function signUp(name: string) {
    const agent = request.agent(app);
    const email = `${name}@gmail.com`;
    const password = "12345678";

    const reg = await agent.post("/api/auth/register").send({ name, email, password });

    if (reg.status !== 201) {
        throw new Error(`register ${name}: ${reg.status} ${JSON.stringify(reg.body)}`)
    }
    const login = await agent.post("/api/auth/login").send({ email, password });

    if (login.status !== 200) {
        throw new Error(`login ${login.status}}`)
    }
    return { agent, id: reg.body.id as string, email }

}


export async function makeAdmin(email: string) {
    await UserModel.updateOne({ email }, { role: "admin" })
}


