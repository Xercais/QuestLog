import { describe, it, expect, beforeEach } from "vitest";
const { validate_skill_name, set_skills_for_testing } = require("../assets/Scripts/skills.js");
describe("validate_skill_name", () =>{
    beforeEach(() => {
        set_skills_for_testing({});
    })
    it("rejects an empty skill name", () => {
        const result = validate_skill_name("");
        expect(result.success).toBe(false);
        expect(result.reason).toBe("Skill Name Cannot Be Empty or WhiteSpace");
    })

    it("rejects whitespace", () => {
        const result = validate_skill_name("          ");
        expect(result.success).toBe(false);
        expect(result.reason).toBe("Skill Name Cannot Be Empty or WhiteSpace");
    })

    it("allows valid skill names", () => {
        const result = validate_skill_name("GUiTar");
        expect(result.success).toBe(true);
        expect(result.normalizedName).toBe("guitar");
    })

    it("rejects duplicate names", () => {
        set_skills_for_testing({coding: {xp: 100}});
        const result = validate_skill_name("COdiNG");
        expect(result.success).toBe(false);
        expect(result.reason).toBe("Skill Already Exists");
    })
})