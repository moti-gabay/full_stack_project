import { expect, it, describe } from "vitest"

import { registerSchema } from "../../schema/user.ts"
import { email } from "zod";

describe("register schema", () => {

    const valid = { name: "Dana", email: "dana@example.com", password: "secret123" };

    it("valide user", () => {
        expect(registerSchema.safeParse(valid).success).toBe(true)
    })
    //TODO check the trim function
    it("lower case the email", () => {
        expect(registerSchema.parse({ name: "Dana", password: "secret123", email: "Dana@example.COM" }))
            .toMatchObject({ email: "dana@example.com" });
    })

    it("drops user with role (admin)", () => {
        expect(registerSchema.parse({ ...valid, role: "admin" })).not.toHaveProperty("role")
    })



    it.each([
        ["a short name", { ...valid, name: "D" }, "name"],
        ["a bad email", { ...valid, email: "dana" }, "email"],
        ["a short password", { ...valid, password: "123" }, "password"],
        ["no password", { name: "Daba", email: "dana@gmail.com" }, "password"],
    ])("rejects %s", (_label, input, fild) => {
        const res = registerSchema.safeParse(input);
        expect(res.success).toBe(false)
        expect(res.error?.issues.map((i) => i.path[0])).toContain(fild)
    })
})