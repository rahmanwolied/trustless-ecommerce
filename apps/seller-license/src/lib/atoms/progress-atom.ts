import { atom, useAtom } from "jotai";

const progressAtom = atom<
  (("current" | "failed") | ("complete" | "failed") | ("upcoming" | "failed"))[]
>(["current", "upcoming", "upcoming"] as const);

export function useProgress() {
  return useAtom(progressAtom);
}
