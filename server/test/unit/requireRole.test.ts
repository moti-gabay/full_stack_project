import { expect, it, describe, vi } from "vitest"
import type { Request, Response } from "express"
import { requireRole } from "../../middlewere/requireAuth.ts"

function run(user: unknown) {
    const req = { user } as unknown as Request
    const res = { status: vi.fn(), json: vi.fn() }
    res.status.mockReturnValue(res)
    const next = vi.fn();
    requireRole("admin")(req, res as unknown as Response, next)
    return { res, next }
}

describe("require role (admin)", () => {
    it("ad admin: next() with no error , on answer", () => {
        const { next, res } = run({ role: "admin" })
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
    })
    it("a regolar user : 403 ,and next() is not called", () => {
        const { next, res } = run({ role: "user" });
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" })
        expect(next).not.toHaveBeenCalled()
    })
})