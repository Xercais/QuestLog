import { describe, it, expect } from "vitest";
const { calculate_level, apply_task_xp, apply_duration_multiplier } = require("../assets/Scripts/xp.js");
describe("calculate_level", () => {
    it("calculates level from zero xp", () => {
        const result = calculate_level(0, 10)
        expect(result).toBe(1)
    })

    it("calculates level 2 at the correct xp threshold", () => {
        const result = calculate_level(100, 10);
        expect(result).toBe(2);
    })

    it("calculates level 1 before level 2 xp threshold", () => {
        const result = calculate_level(99, 10);
        expect(result).toBe(1);
    })
})

describe("apply_task_xp", () => {
    it("calculates xp for a basic repeated task", () => {
        const task = {taskMode: "repeated", difficulty: "easy"};
        const playerstate = {globalLevel: 3, streak: 0};
        const result = apply_task_xp(task, playerstate);
        expect(result).toStrictEqual({globalXPtoAdd: 10, skillXPtoAdd: 20});
    })
})

describe("apply_duration_multiplier", () => {
    it("adds duration xp", () => {
        const result = apply_duration_multiplier(25, {duration: 30});
        expect(result).toBe(85);
    })
})