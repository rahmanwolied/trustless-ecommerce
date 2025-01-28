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

export const pollForProof = async (
  presentationExchangeId: string,
  timeoutMs: number = 60000
): Promise<Proof | null> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const verifyPresentation = async () => {
      try {
        const recordResponse = await axios.get(
          `${ACAPY_API_URL}/present-proof-2.0/records/${presentationExchangeId}`
        );
        const state = recordResponse.data.state;

        console.log("Proof state:", state);

        if (state === "presentation-received") {
          const verifyResponse = await axios.post(
            `${ACAPY_API_URL}/present-proof-2.0/records/${presentationExchangeId}/verify-presentation`
          );
          console.log("Verify response:", verifyResponse.data);

          if (verifyResponse.data.verified) {
            return verifyResponse.data as Proof;
          }
        }

        return null;
      } catch (error) {
        console.error("Error verifying presentation:", error);
        throw error;
      }
    };

    const poll = async () => {
      try {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error("Proof verification polling timed out"));
          return;
        }

        const isVerified = await verifyPresentation();
        if (isVerified) {
          resolve(isVerified);
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

type Proof = {
  state:
    | "done"
    | "abandoned"
    | "presentation-sent"
    | "proposal-sent"
    | "request-received";
  created_at: string;
  updated_at: string;
  trace: boolean;
  pres_ex_id: string;
  connection_id: string;
  thread_id: string;
  initiator: "self" | "external";
  role: "prover" | "verifier";
  verified?: "true" | "false";
  verified_msgs?: string[];
  auto_present: boolean;
  auto_verify: boolean;
  auto_remove: boolean;
  by_format?: {
    pres_request?: {
      indy?: {
        name: string;
        nonce: string;
        requested_attributes: Record<
          string,
          {
            name: string;
            restrictions: Array<{
              cred_def_id: string;
            }>;
          }
        >;
        requested_predicates: Record<string, any>;
        version: string;
      };
    };
    pres?: {
      indy?: {
        requested_proof: {
          revealed_attrs: Record<
            string,
            {
              sub_proof_index: number;
              raw: string;
              encoded: string;
            }
          >;
          self_attested_attrs: Record<string, any>;
          unrevealed_attrs: Record<string, any>;
          predicates: Record<string, any>;
        };
        identifiers: Array<{
          schema_id: string;
          cred_def_id: string;
          rev_reg_id: string | null;
          timestamp: string | null;
        }>;
      };
    };
  };
};
