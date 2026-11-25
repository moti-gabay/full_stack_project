import { it, expect, describe } from "vitest";
import { addItem, doubleAll } from "./list";


it("double every number", () => {
    expect(doubleAll([1, 2, 3])).toEqual([2, 4, 6])
})

it("add item to array", () => {
    const res = addItem(["milk"], "bread")
    expect(res).toContain("bread");
    expect(res).toHaveLength(2)
})