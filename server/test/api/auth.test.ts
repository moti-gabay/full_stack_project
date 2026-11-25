import "../setup.ts";
import { expect, it, describe, vi, beforeAll } from "vitest"
import request from "supertest";
import { app } from "../../app.ts";
import { UserModel } from "../../model/user.ts";

describe("POST /api/auth/register", () => {
    it("201 with {id email} , and password is stored hashed", async () => {
        const res = await request(app).post("/api/auth/register")
            .send({ name: "Dana", email: "dana@gmail.com", password: "secret123" })

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: expect.any(String), email: "dana@gmail.com" })

        const inDB = await UserModel.findById(res.body.id).select("+password");
        expect(inDB?.password).not.toBe("secret123");
        expect(inDB?.password).toMatch(/^\$2[aby]\$10\$/)
    })

    it("no password is 400 with fild ", async () => {
        const res = await request(app).post("/api/auth/register")
            .send({ name: "Dana", email: "dana@gmail.com" })

        expect(res.status).toBe(400)
        expect(res.body.details.fieldErrors).toHaveProperty("password");
    })
    it("role: admin in body id ignore", async () => {
        const res = await request(app).post("/api/auth/register")
            .send({ name: "Dana", email: "dana1@gmail.com", password: "secret123", role: "admin" })
        expect(res.status).toBe(201);
        expect(await UserModel.findById(res.body.id)).toMatchObject({ role: "user" })
    })

})

describe("PORT /api/auth/login", () => {
    it("sets an httpOnly cookie", async () => {
        const res = await request(app).post("/api/auth/login")
            .send({ email: "dana@gmail.com", password: "secret123" })
        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']?.[0]).toMatch(/^token=.+HttpOnly/i)
    })

    it("a wrong email or password get same status 401", async () => {
        const wrongPass = await request(app).post("/api/auth/login")
            .send({ email: "dana@gmail.com", password: "secret124" })
        const wrongEmail = await request(app).post("/api/auth/login")
            .send({ email: "danaa@gmail.com", password: "secret123" })
        expect(wrongPass.status).toBe(401)
        expect(wrongEmail.status).toBe(401)

    })
})


describe("GET /api/auth/me", () => {

    const agent = request.agent(app);

    beforeAll(async () => {
        await agent.post("/api/auth/login")
            .send({ email: "dana@gmail.com", password: "secret123" })

    })

    // it("{user} without password", async () => {
    //     const res = await agent.get("/api/auth/me")
    //     // expect(res.status).toBe(200);
    //     // expect(res.body.user).toMatchObject({ email: "dana@gmail.com", role: "user" })
    //     // expect(res.body.user).not.toHaveProperty("password")
    // })
    it("with grbage token status 401 not a crash", async () => {
           const res = await agent.get("/api/auth/me").set("Cookie","token=grbage");
           expect(res.status).toBe(401)
           expect(res.body).toMatchObject({ error: "invalide token"})
    })
    it("without token status 401", async () => {
           const res = await agent.get("/api/auth/me")
           expect(res.status).toBe(401)
    })
})
