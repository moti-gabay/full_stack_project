import { it, expect, describe } from "vitest";
import { divide, isEven, sum } from "./math";

describe("math functions", () => {


    it("sum to numbers", () => {
        expect(sum(1, 2)).toBe(3)
    })

    it("if is even number", () => {
        expect(isEven(3)).toBeFalsy()
    })
    it("is devided",() => {
        expect(divide(10,2)).toBe(5)
    })
})