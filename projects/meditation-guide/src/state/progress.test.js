import { describe, expect, it } from "vitest";
import {
  completeSession,
  initialProgress,
  loadProgress,
  recommendNext,
} from "./progress";
describe("progress", () => {
  it("falls back when storage is empty or corrupt", () => {
    expect(loadProgress({ getItem: () => null })).toEqual(initialProgress);
    expect(loadProgress({ getItem: () => "{" })).toEqual(initialProgress);
  });
  it("records completion without retaining reflection", () => {
    const next = completeSession(initialProgress, {
      day: 1,
      duration: 180,
      reflection: "tense",
      note: "我发现了走神",
    });
    expect(next.completed).toEqual([1]);
    expect(next.totalSeconds).toBe(180);
    expect(next.notes[1]).toBe("我发现了走神");
    expect(JSON.stringify(next)).not.toContain("tense");
    expect(recommendNext(next)).toBe(2);
  });
});
