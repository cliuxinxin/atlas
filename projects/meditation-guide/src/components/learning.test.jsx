// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Perspectives from "./Perspectives";
import { buildShareModel } from "./ShareCard";
import { curriculum } from "../content/curriculum";
afterEach(cleanup);
describe("layered learning", () => {
  it("labels and reveals all three perspectives", () => {
    render(<Perspectives lesson={curriculum[0]} />);
    for (const name of ["科学视角", "生活视角", "传统智慧"]) {
      fireEvent.click(screen.getByRole("button", { name }));
      expect(screen.getByRole("region").textContent.length).toBeGreaterThan(20);
    }
  });
  it("excludes sensitive fields from sharing", () => {
    const model = buildShareModel(
      {
        completed: [1, 2],
        totalSeconds: 480,
        notes: { 1: "心得" },
        reflection: "tense",
      },
      { includeNote: false },
    );
    expect(model).toEqual({ days: 2, minutes: 8, skills: ["安住", "回来"] });
    expect(JSON.stringify(model)).not.toContain("tense");
  });
});
