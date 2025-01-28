import { atom, useAtom } from "jotai";

const connectionIdAtom = atom<string | null>(null);

export function useConnectionIdAtom() {
  return useAtom(connectionIdAtom);
}
