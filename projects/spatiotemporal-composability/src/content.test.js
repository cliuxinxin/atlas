import { describe, expect, it } from "vitest";
import {
  claimBoundaries,
  contributions,
  deepDiveChapters,
  glossary,
  pageMap,
  quickTour,
} from "./content";

describe("paper content", () => {
  it("provides both reading layers", () => {
    expect(quickTour).toHaveLength(5);
    expect(deepDiveChapters.map(({ id }) => id)).toEqual([
      "motivation", "preliminaries", "effects", "coeffects", "context",
      "calculus", "metatheory", "cordis", "discussion", "assessment",
    ]);
  });

  it("keeps claims attributable and scoped", () => {
    expect(contributions).toHaveLength(5);
    expect(glossary.length).toBeGreaterThanOrEqual(12);
    expect(claimBoundaries.every((item) => item.proves && item.doesNotProve)).toBe(true);
    expect(deepDiveChapters.every((item) =>
      item.plain && item.developer && item.formal && item.kind && item.pages.length > 0
    )).toBe(true);
  });

  it("only points into the 88-page source", () => {
    const pages = [];
    const visit = (value, key = "") => {
      if (Array.isArray(value)) {
        if (key === "pages") value.forEach((page) => pages.push(page));
        else value.forEach((item) => visit(item));
      } else if (value && typeof value === "object") {
        Object.entries(value).forEach(([childKey, child]) => {
          if (childKey === "page" && typeof child === "number") pages.push(child);
          else visit(child, childKey);
        });
      }
    };
    [quickTour, deepDiveChapters, glossary, contributions, claimBoundaries, pageMap].forEach((data) => visit(data));
    expect(pages.length).toBeGreaterThan(30);
    expect(pages.every((page) => Number.isInteger(page) && page >= 1 && page <= 88)).toBe(true);
  });
});
