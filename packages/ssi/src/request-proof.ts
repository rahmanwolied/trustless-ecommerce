import axios from "axios";
import { ACAPY_API_URL } from "./config";
import {
  nidCredentialInfo,
  sellerLicenseCredentialInfo,
} from "./constants/credential-definitions";

export async function requestNidProof(connectionId: string) {
  if (!connectionId) {
    throw new Error("No connection ID found");
  }

  const credDefId = nidCredentialInfo.credentialDefinitionId;

  const body = {
    auto_remove: false,
    auto_verify: false,
    comment: "Proof request for NID",
    connection_id: connectionId,
    presentation_request: {
      indy: {
        name: "Proof request",
        nonce: "12",
        requested_attributes: {
          nid_number: {
            name: "nid_number",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          first_name: {
            name: "first_name",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          last_name: {
            name: "last_name",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
        },
        requested_predicates: {},
        version: "1.0",
      },
    },
    trace: true,
  };

  try {
    const response = await axios.post(
      `${ACAPY_API_URL}/present-proof-2.0/send-request`,
      body
    );

    if (response.status !== 200) {
      return { data: null, success: false, message: response.data.message };
    }

    console.log("proof request response", response.data);

    return {
      data: response.data,
      success: true,
      message: "Proof request sent",
    };
  } catch (error) {
    console.error("Error sending proof request:", error);
    return {
      data: null,
      success: false,
      message: "Error sending proof request",
    };
  }
}

export async function requestSellerProof(connectionId: string) {
  if (!connectionId) {
    throw new Error("No connection ID found");
  }

  const credDefId = sellerLicenseCredentialInfo.credentialDefinitionId;

  const body = {
    auto_remove: false,
    auto_verify: false,
    comment: "Proof request for seller license",
    connection_id: connectionId,
    presentation_request: {
      indy: {
        name: "Proof request",
        nonce: "12",
        requested_attributes: {
          company_name: {
            name: "company_name",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          company_address: {
            name: "company_address",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          tin: {
            name: "tin",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          phone_number: {
            name: "phone_number",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          type: {
            name: "type",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          seller_first_name: {
            name: "seller_first_name",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
          seller_last_name: {
            name: "seller_last_name",
            restrictions: [
              {
                cred_def_id: credDefId,
              },
            ],
          },
        },
        requested_predicates: {},
        version: "1.0",
      },
    },
    trace: true,
  };

  try {
    const response = await axios.post(
      `${ACAPY_API_URL}/present-proof-2.0/send-request`,
      body
    );

    if (response.status !== 200) {
      return { data: null, success: false, message: response.data.message };
    }

    console.log("proof request response", response.data);

    return {
      data: response.data,
      success: true,
      message: "Proof request sent",
    };
  } catch (error) {
    console.error("Error sending proof request:", error);
    return {
      data: null,
      success: false,
      message: "Error sending proof request",
    };
  }
}
