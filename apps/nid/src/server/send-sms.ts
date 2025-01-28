"use server";

import axios from "axios";

export const sendSMS = async (phoneNumber: string, message: string) => {
  try {
    const response = await axios.post(
      `https://api.sms.net.bd/sendsms?api_key=${process.env.SMS_API_KEY}&msg=${message}&to=${phoneNumber}`
    );
    if (response.status === 200) {
      return {
        data: response.data,
        success: true as const,
        message: "SMS sent successfully",
      };
    } else {
      return {
        data: null,
        success: false as const,
        message: "Failed to send SMS",
      };
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      data: null,
      success: false as const,
      message: "Failed to send SMS",
    };
  }
};
