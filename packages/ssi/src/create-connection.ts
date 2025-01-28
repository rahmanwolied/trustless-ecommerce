import axios from "axios";
import { ACAPY_API_URL, DEFAULT_INVITATION_BODY } from "./config";

export const createConnection = async () => {
  try {
    const response = await axios.post(
      `${ACAPY_API_URL}/out-of-band/create-invitation`,
      DEFAULT_INVITATION_BODY
    );
    if (response.status === 200) {
      return { data: response.data, success: true };
    }
    return { data: null, success: false };
  } catch (error) {
    console.error(error);
    return { data: null, success: false };
  }
};
