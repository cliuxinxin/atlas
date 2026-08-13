// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import App from "./App";

afterEach(cleanup);

describe("paper reader", () => {
  it("offers both reading layers and source paper", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /时空可组合性/ })).toBeTruthy();
    expect(screen.getByText(/Yifan Shi/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /10 分钟看懂/ }).getAttribute("href")).toBe("#quick-tour");
    expect(screen.getByRole("link", { name: /进入完整导读/ }).getAttribute("href")).toBe("#deep-dive");
    expect(screen.getByRole("link", { name: /阅读原论文/ }).getAttribute("href")).toMatch(/paper\.pdf$/);
    expect(screen.getAllByTestId("tour-step")).toHaveLength(5);
  });

  it("reveals optional formal detail", () => {
    render(<App />);
    const summary = screen.getAllByText(/展开公式与形式化要点/)[0];
    fireEvent.click(summary);
    expect(screen.getAllByTestId("formal-note")[0].textContent.length).toBeGreaterThan(20);
  });

  it("runs the guided component lifecycle", () => {
    render(<App />);
    expect(screen.getByTestId("lab-status").textContent).toContain("未加载");
    fireEvent.click(screen.getByRole("button", { name: "加载插件" }));
    expect(screen.getByTestId("lab-status").textContent).toContain("等待 Database");
    fireEvent.click(screen.getByRole("button", { name: "提供数据库" }));
    expect(screen.getByTestId("lab-status").textContent).toContain("运行中 · Database v1");
    fireEvent.click(screen.getByRole("button", { name: "替换为 v2" }));
    expect(screen.getByTestId("lab-status").textContent).toContain("Database v2");
    fireEvent.click(screen.getByRole("button", { name: "移除数据库" }));
    expect(screen.getByTestId("lab-status").textContent).toContain("依赖缺失");
    fireEvent.click(screen.getByRole("button", { name: "卸载插件" }));
    expect(screen.getByTestId("lab-status").textContent).toContain("未加载");
    expect(screen.getByTestId("context-logger").textContent).toContain("可用");
  });

  it("defines the required responsive editorial system", () => {
    const css = readFileSync("src/styles.css", "utf8");
    ["--paper", "--ink", "--temporal", "--spatial", "@media (max-width: 760px)", "prefers-reduced-motion", ":focus-visible"].forEach((token) => expect(css).toContain(token));
  });
});
