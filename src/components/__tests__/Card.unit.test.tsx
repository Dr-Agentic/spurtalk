import React from "react";
import TestRenderer, { act, type ReactTestInstance } from "react-test-renderer";
import Card, {
  canTransition,
  cardAllowedTransitions,
  initialCardLifecycleState,
  nextCardState,
} from "../Card";

describe("Card lifecycle", () => {
  test("initial state is 'initial'", () => {
    expect(initialCardLifecycleState).toBe("initial");
  });

  test("canTransition matches transition map", () => {
    const states = Object.keys(cardAllowedTransitions) as Array<
      keyof typeof cardAllowedTransitions
    >;

    for (const from of states) {
      const allowed = new Set(cardAllowedTransitions[from]);
      for (const to of states) {
        expect(canTransition(from, to)).toBe(allowed.has(to));
      }
    }
  });

  test("nextCardState returns desired when allowed", () => {
    expect(nextCardState("initial", "loading")).toBe("loading");
    expect(nextCardState("loading", "active")).toBe("active");
    expect(nextCardState("active", "completed")).toBe("completed");
  });

  test("nextCardState keeps current when blocked", () => {
    expect(nextCardState("initial", "active")).toBe("initial");
    expect(nextCardState("completed", "initial")).toBe("completed");
    expect(nextCardState("discarded", "active")).toBe("discarded");
  });

  test("component renders initial state", () => {
    let tr!: TestRenderer.ReactTestRenderer;
    act(() => {
      tr = TestRenderer.create(<Card />);
    });
    const strong = tr.root.findByType("strong");
    expect(strong.children.join("")).toBe("initial");
  });

  test("component transitions through valid lifecycle via buttons", () => {
    let tr!: TestRenderer.ReactTestRenderer;
    act(() => {
      tr = TestRenderer.create(<Card />);
    });

    const getStatus = () => tr.root.findByType("strong").children.join("");
    const findButton = (label: string) =>
      tr.root
        .findAllByType("button")
        .find((b: ReactTestInstance) => b.children.join("") === label);

    const open = findButton("Open");
    const ready = findButton("Ready");
    const finish = findButton("Finish");
    const close = findButton("Close");

    if (!open || !ready || !finish || !close) {
      throw new Error("Expected Card to render all lifecycle buttons");
    }

    expect(getStatus()).toBe("initial");
    act(() => open.props.onClick());
    expect(getStatus()).toBe("loading");
    act(() => ready.props.onClick());
    expect(getStatus()).toBe("active");
    act(() => finish.props.onClick());
    expect(getStatus()).toBe("completed");
  });

  test("component blocks invalid transitions", () => {
    let tr!: TestRenderer.ReactTestRenderer;
    act(() => {
      tr = TestRenderer.create(<Card />);
    });

    const getStatus = () => tr.root.findByType("strong").children.join("");
    const finish = tr.root
      .findAllByType("button")
      .find((b: ReactTestInstance) => b.children.join("") === "Finish");
    const close = tr.root
      .findAllByType("button")
      .find((b: ReactTestInstance) => b.children.join("") === "Close");

    if (!finish || !close) {
      throw new Error("Expected Card to render lifecycle buttons");
    }

    expect(getStatus()).toBe("initial");
    act(() => finish.props.onClick());
    expect(getStatus()).toBe("initial");

    act(() => close.props.onClick());
    expect(getStatus()).toBe("initial");
  });
});
