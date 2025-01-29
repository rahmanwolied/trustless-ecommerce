"use server";

import { prisma } from "@repo/db";
import { sendSMS } from "./send-sms";

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
  // const otp = "123456";

  const message = `Your OTP is ${otp}. Please enter it to verify your phone number.`;

  const response = await sendSMS(phoneNumber, message);
  if (!response.success)
    return {
      data: null,
      success: false,
      message: "Failed to send OTP",
    };

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
      success: false as const,
      message: "User not found",
    };

  if (user.otp !== otp)
    return {
      data: null,
      success: false as const,
      message: "OTP does not match",
    };

  if (user.otpExpiry && user.otpExpiry < new Date())
    return {
      data: null,
      success: false as const,
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

  const nidCredentialInfo = {
    first_name: user.firstName,
    last_name: user.lastName,
    date_of_birth: user.dateOfBirth.toISOString(),
    gender: user.gender,
    address: user.address,
    phone_number: user.phoneNumber,
    nid_number: user.nidNumber,
  };

  return {
    data: nidCredentialInfo,
    success: true as const,
    message: "OTP verified successfully",
  };
}
