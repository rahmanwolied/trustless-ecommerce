"use client";

import { Button } from "./ui/button";
import { logout } from "@/server/verify-token";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await logout();
        router.push("/");
      }}
    >
      Logout
    </Button>
  );
}
