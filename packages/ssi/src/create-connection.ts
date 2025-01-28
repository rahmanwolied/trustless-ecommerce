import axios from "axios";
import { ACAPY_API_URL, DEFAULT_INVITATION_BODY } from "./config";

type CreateConnectionProps = {
  alias: string;
  goal: string;
  goal_code: string;
  my_label: string;
};

export const createConnection = async (props?: CreateConnectionProps) => {
  try {
    const response = await axios.post(
      `${ACAPY_API_URL}/out-of-band/create-invitation`,
      {
        ...DEFAULT_INVITATION_BODY,
        ...props,
      }
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
