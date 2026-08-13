import { describe, expect, it } from "vitest";
import { curriculum } from "./curriculum";
describe("curriculum", () => {
  it("maps a complete 21 day path", () => expect(curriculum).toHaveLength(21));
  it("makes the first seven lessons fully practiceable", () => {
    curriculum.slice(0, 7).forEach((lesson) => {
      expect(lesson.locked).toBe(false);
      expect(lesson.steps.length).toBeGreaterThan(2);
      expect(Object.keys(lesson.perspectives)).toEqual([
        "science",
        "life",
        "tradition",
      ]);
    });
    expect(curriculum.slice(7).every((lesson) => lesson.locked)).toBe(true);
  });
});
