import "../setup.ts";
import { expect, it, describe, vi } from "vitest"
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
})
