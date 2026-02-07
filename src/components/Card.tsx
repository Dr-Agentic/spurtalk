import React, { useState } from "react";
import type { CardLifecycleState } from "../../shared/src/types";

export const initialCardLifecycleState: CardLifecycleState = "initial";

export type AllowedTransitions = Record<
  CardLifecycleState,
  CardLifecycleState[]
>;

export const cardAllowedTransitions: AllowedTransitions = {
  initial: ["loading"],
  loading: ["active", "discarded"],
  active: ["completed", "discarded"],
  completed: [],
  discarded: [],
};

export function canTransition(
  from: CardLifecycleState,
  to: CardLifecycleState,
  transitions: AllowedTransitions = cardAllowedTransitions
): boolean {
  return transitions[from].includes(to);
}

export function nextCardState(
  current: CardLifecycleState,
  desired: CardLifecycleState,
  transitions: AllowedTransitions = cardAllowedTransitions
): CardLifecycleState {
  return canTransition(current, desired, transitions) ? desired : current;
}

const Card: React.FC = () => {
  const [state, setState] = useState<CardLifecycleState>(
    initialCardLifecycleState
  );

  const transition = (newState: CardLifecycleState) => {
    setState((prev) => nextCardState(prev, newState));
  };

  return (
    <div data-testid="card" className="border border-border p-2 rounded-sm">
      <h3>Card</h3>
      <p>
        Status: <strong>{state}</strong>
      </p>
      <button
        onClick={() => transition("loading")}
        className="px-3 py-1 border border-input rounded-md hover:bg-accent"
      >
        Open
      </button>
      <button
        onClick={() => transition("active")}
        className="px-3 py-1 border border-input rounded-md hover:bg-accent"
      >
        Ready
      </button>
      <button
        onClick={() => transition("completed")}
        className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Finish
      </button>
      <button
        onClick={() => transition("discarded")}
        className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
      >
        Close
      </button>
    </div>
  );
};

export default Card;
