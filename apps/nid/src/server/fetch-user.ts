"use server";

import { prisma } from "@repo/db";

export async function fetchUser(nidNumber: string) {
  const user = await prisma.nid.findMany();
  console.log("user", user);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
