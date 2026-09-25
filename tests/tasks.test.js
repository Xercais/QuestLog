import { describe, it, expect } from "vitest";
const {create_task} = require("../assets/Scripts/ui.js")
describe("create_task", () => {
    it("creates a milestone task", () => {
        const result = create_task({data: {mode: "milestone", name: "test"}, skillName: "coding"});
        expect(result.skillName).toBe("coding");
        expect(result.completed).toBe(false);
        expect(result.config).toStrictEqual({mode: "milestone"});
        expect(result.name).toBe("test");
    })

    it("creates a timed task", () => {
        const result = create_task({data: {mode: "timed", name: "practice", duration: 30}, skillName: "coding"});
        expect(result.skillName).toBe("coding");
        expect(result.completed).toBe(false);
        expect(result.config).toStrictEqual({duration: 30, mode: "timed"});
        expect(result.name).toBe("practice");
    })

    it("creates a repeated task", () => {
        const result = create_task({data: {mode: "repeated", number: 3, duration: 20}, skillName: "coding"});
        expect(result.skillName).toBe("coding");
        expect(result.completed).toBe(false);
        expect(result.config).toStrictEqual({mode: "repeated", number: 3, duration: 20})
    })
})