import { it, expect } from "vitest";
import { sum } from "./math.ts";



it("add tow numbers",() => {
    expect(sum(1,2)).toBe(3)
})