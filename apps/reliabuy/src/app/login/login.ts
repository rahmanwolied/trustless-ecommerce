"use server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma, Seller } from "@repo/db";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

export async function login(
  type: string,
  verified: boolean,
  name: string,
  address: string,
  phone: string
) {
  try {
    let seller: Seller | null = null;

    if (type === "seller") seller = await getUser(name, address, phone);

    // Create JWT token with user data
    const token = await new SignJWT({
      type,
      verified,
      name,
      trustFactor: seller?.trustFactor || 0,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set cookie with JWT
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed" };
  }
}

async function getUser(name: string, address: string, phone: string) {
  const user = await prisma.seller.upsert({
    where: { name },
    update: {},
    create: { name, trustFactor: 0, address, phone },
  });
  return user;
}
