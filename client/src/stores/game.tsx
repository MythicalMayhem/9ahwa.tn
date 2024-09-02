import { create } from "zustand";

interface chkobaState {
  hand: Array<string>;
  ground: Array<string>;
  ate: Array<string>;
  setHand: (hand: chkobaState["hand"]) => void;
  addAte: (card: string) => void;
}

export const chkoba = create<chkobaState>((set) => ({
  hand: [],
  ground: [],
  ate: [],
  setHand: (hand: chkobaState["hand"]) => set({ hand }),
  addAte: (card: string) => set((state) => ({ ate: [...state.ate, card] })),
}));
