"use server";

import { prisma } from "@repo/db";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function sendOTP(phoneNumber: string, nidNumber: string) {
  const user = await prisma.nid.findUnique({ where: { nidNumber } });
  if (!user)
    return {
      data: null,
      success: false,
      message: "User not found",
    };

  const userPhoneNumber = user.phoneNumber;
  if (userPhoneNumber !== phoneNumber)
    return {
      data: null,
      success: false,
      message: "Phone number does not match",
    };

  const otp = generateOTP();

  console.log(otp);

  await prisma.nid.update({
    where: { nidNumber },
    data: {
      otp,
      otpSentAt: new Date(),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return {
    data: otp,
    success: true,
    message: "OTP sent successfully",
  };
}

export async function verifyOTP(nidNumber: string, otp: string) {
  const user = await prisma.nid.findUnique({ where: { nidNumber } });
  if (!user)
    return {
      data: null,
      success: false,
      message: "User not found",
    };

  if (user.otp !== otp)
    return {
      data: null,
      success: false,
      message: "OTP does not match",
    };

  if (user.otpExpiry && user.otpExpiry < new Date())
    return {
      data: null,
      success: false,
      message: "OTP expired",
    };

  await prisma.nid.update({
    where: { nidNumber: user.nidNumber },
    data: {
      otp: null,
      otpExpiry: null,
      otpSentAt: null,
      otpVerifiedAt: new Date(),
      otpVerifiedCount: user.otpVerifiedCount + 1,
    },
  });

  return {
    data: user,
    success: true,
    message: "OTP verified successfully",
  };
}
