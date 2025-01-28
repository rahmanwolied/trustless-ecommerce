import { atom, useAtom } from "jotai";

const formAtom = atom<{
  nidNumber: string;
  firstName: string;
  lastName: string;
} | null>(null);

export function useFormAtom() {
  return useAtom(formAtom);
}
