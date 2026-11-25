import { it, expect, describe } from "vitest";
import { isAdult, makeUser } from "./people";

describe("is adult", () => {



    it("return false at 17", () => {
        expect(isAdult(17)).toBe(false)
    })
    it("return treu at 18", () => {
        expect(isAdult(18)).toBe(true)
    })

    describe("make user", () => {
        it("create user with the role 'user'", () => {
            expect(makeUser("Dana")).toEqual({ name: "Dana", role: "user", active: true })
        })
         it("never create user with role admin", () => {
            expect(makeUser("Dana").role).not.toBe("admin")
        })

    })

})