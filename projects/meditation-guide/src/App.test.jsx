// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
beforeEach(() => {
  const values = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
});
afterEach(cleanup);
describe("app", () => {
  it("starts the first practice within two actions", () => {
    render(<App />);
    fireEvent.click(screen.getByText("开始 3 分钟"));
    expect(screen.getByRole("heading", { name: "呼吸与身体" })).toBeTruthy();
  });
  it("shows all path states", () => {
    render(<App />);
    fireEvent.click(screen.getByText("路径"));
    expect(screen.getByText("21 天能力地图")).toBeTruthy();
    expect(screen.getAllByText("尚未解锁").length).toBeGreaterThan(0);
  });
});
