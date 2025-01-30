import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import Cookies from "js-cookie";

const useSecureCookies = process.env.NODE_ENV === "production";

const cookieStorage = createJSONStorage<string>(() => ({
  getItem: () => Cookies.get("connection_id") ?? null,
  setItem: (ctx, value) =>
    Cookies.set(ctx, value, {
      domain: useSecureCookies ? ".reliabuy.com" : "localhost",
      sameSite: "lax",
      secure: useSecureCookies,
    }),
  removeItem: (ctx) => Cookies.remove(ctx),
}));

export const connectionIdAtom = atomWithStorage<string>(
  "connection_id",
  "",
  cookieStorage
);

export function useConnectionIdAtom() {
  return useAtom(connectionIdAtom);
}
