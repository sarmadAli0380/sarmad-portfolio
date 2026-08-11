"use client";

import { useSyncExternalStore } from "react";
import type { FormationId } from "./content";

/**
 * Tiny external store. The DOM sections and the WebGL scene live in different
 * render trees; this is the wire between them. Not worth a dependency.
 */

type State = {
  formation: FormationId;
  /**
   * How much presence the field is allowed in the current section. Sparse
   * sections give it the room to be the subject; dense case-study prose pushes
   * it back to being atmosphere. Legibility wins every time.
   */
  intensity: number;
  /** id of the section currently owning the viewport */
  activeSection: string;
  /** 0 → 1 across the whole document */
  scroll: number;
  /** loader finished, reveal may start */
  entered: boolean;
  /** user has a pointing device and it's over the canvas */
  pointerActive: boolean;
};

let state: State = {
  formation: "latent",
  intensity: 1,
  activeSection: "hero",
  scroll: 0,
  entered: false,
  pointerActive: false,
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setState(patch: Partial<State>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof State)[]) {
    if (state[k] !== patch[k]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function snapshot() {
  return state;
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(snapshot()),
    () => select(state),
  );
}

/** Read without subscribing — for use inside useFrame. */
export function readState() {
  return state;
}
