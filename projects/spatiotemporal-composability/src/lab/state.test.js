import { describe, expect, it } from "vitest";
import {
  getAvailableActions,
  getContextRows,
  getDependencyEdges,
  initialLabState,
  labReducer,
} from "./state";

describe("composition lab", () => {
  it("runs dependency and withdrawal lifecycle", () => {
    let state = initialLabState;
    state = labReducer(state, { type: "LOAD_PLUGIN" });
    expect(state.pluginLoaded).toBe(true);
    expect(state.pluginActive).toBe(false);

    state = labReducer(state, { type: "PROVIDE_DATABASE" });
    expect(state.database).toBe("v1");
    expect(state.pluginActive).toBe(true);
    expect(state.effects.map((item) => item.id)).toEqual(["event", "timer"]);

    state = labReducer(state, { type: "REPLACE_DATABASE" });
    expect(state.database).toBe("v2");
    expect(state.log.at(-1).concept).toBe("reactive coeffect");

    state = labReducer(state, { type: "REMOVE_DATABASE" });
    expect(state.pluginActive).toBe(false);
    expect(state.effects).toEqual([]);

    state = labReducer(state, { type: "UNLOAD_PLUGIN" });
    expect(state.pluginLoaded).toBe(false);
    expect(state.loggerAvailable).toBe(true);
  });

  it("guards invalid transitions and resets", () => {
    expect(labReducer(initialLabState, { type: "REPLACE_DATABASE" })).toBe(initialLabState);
    const loaded = labReducer(initialLabState, { type: "LOAD_PLUGIN" });
    expect(labReducer(loaded, { type: "LOAD_PLUGIN" })).toBe(loaded);
    expect(labReducer(loaded, { type: "RESET" })).toEqual(initialLabState);
  });

  it("derives consistent context, edges, and controls", () => {
    const loaded = labReducer(initialLabState, { type: "LOAD_PLUGIN" });
    const active = labReducer(loaded, { type: "PROVIDE_DATABASE" });
    expect(getAvailableActions(active)).toMatchObject({ replace: true, removeDatabase: true, unload: true });
    expect(getDependencyEdges(active).map(({ target }) => target)).toEqual(["Logger", "Database v1"]);
    expect(getContextRows(active).find(({ id }) => id === "timer").present).toBe(true);
  });
});
