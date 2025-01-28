import axios from "axios";
import { ACAPY_API_URL } from "./config";

export const pollForConnection = (
  inviteMsgId: string,
  timeoutMs: number = 60000
): Promise<Connection | null> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkConnections = async () => {
      try {
        const response = await axios.get(
          `${ACAPY_API_URL}/connections?invitation_msg_id=${inviteMsgId}`
        );

        if (response.status === 200 && response.data?.results?.length > 0) {
          console.log("response", response.data);
          const connection: Connection = response.data.results[0];

          if (["invitation", "request"].includes(connection.state)) {
            return null;
          }

          if (["error", "abandoned"].includes(connection.state)) {
            throw new Error(
              `Connection failed with state: ${connection.state}`
            );
          }

          if (["active", "response"].includes(connection.state)) {
            return connection;
          }
        }
        return null;
      } catch (error) {
        console.error("Error checking connections:", error);
        throw error;
      }
    };

    const poll = async () => {
      try {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error("Connection polling timed out"));
          return;
        }

        const connection = await checkConnections();
        if (connection) {
          resolve(connection);
        } else {
          setTimeout(poll, 2000);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
};

type Connection = {
  state:
    | "active"
    | "invitation"
    | "request"
    | "error"
    | "abandoned"
    | "response";
  created_at: string;
  updated_at: string;
  connection_id: string;
  my_did?: string;
  their_did?: string;
  their_label?: string;
  their_role: "invitee";
  connection_protocol: "didexchange/1.0" | "didexchange/1.1";
  rfc23_state: "completed" | "invitation-sent";
  invitation_key: string;
  invitation_msg_id: string;
  request_id?: string;
  accept: "auto";
  invitation_mode: "once";
  alias: string;
};
