"use server";
import axios from "axios";
import {
  ACAPY_API_URL,
  NID_SCHEMA,
  RECEIPT_SCHEMA,
  SELLER_LICENSE_SCHEMA,
} from "./config";

const schemas = [RECEIPT_SCHEMA];

async function createSchema(
  schemaData:
    | typeof NID_SCHEMA
    | typeof SELLER_LICENSE_SCHEMA
    | typeof RECEIPT_SCHEMA
) {
  try {
    const body = {
      attributes: schemaData.attributes,
      schema_name: schemaData.name,
      schema_version: schemaData.version,
    };
    const exists = await axios.get(`${ACAPY_API_URL}/schemas/created`, {
      params: {
        schema_name: schemaData.name,
      },
    });

    if (exists.data && exists.data.schema_ids.length > 0) {
      return exists.data.schema_ids[0];
    }

    const response = await axios.post(`${ACAPY_API_URL}/schemas`, body);

    console.log("schema response", response.data);

    return response.data.sent.schema_id;
  } catch (error) {
    console.error("Error creating schema:", error);
    throw error;
  }
}

async function createCredentialDefinition(schemaId: string, tag: string) {
  try {
    const exists = await axios.get(
      `${ACAPY_API_URL}/credential-definitions/created`,
      {
        params: {
          schema_id: schemaId,
        },
      }
    );

    if (exists.data && exists.data.credential_definition_ids.length > 0) {
      return exists.data.credential_definition_ids[0];
    }

    const response = await axios.post(
      `${ACAPY_API_URL}/credential-definitions`,
      {
        schema_id: schemaId,
        tag: tag,
        support_revocation: false,
      }
    );

    console.log("credential definition response", response.data);

    return response.data.sent.credential_definition_id;
  } catch (error) {
    console.error("Error creating credential definition:", error);
    throw error;
  }
}

async function createSchemaAndCredDef() {
  try {
    const schemaIds: string[] = [];
    const credentialDefinitionIds: string[] = [];

    for (const _schema of schemas) {
      const schemaId = await createSchema(_schema);
      schemaIds.push(schemaId);

      const credentialDefinition = await createCredentialDefinition(
        schemaId,
        _schema.tag
      );
      credentialDefinitionIds.push(credentialDefinition);
    }
    const jsonOutput = {
      schemaIds,
      credentialDefinitionIds,
    };

    const nidString = `export const nidCredentialInfo = {
    schema: NID_SCHEMA,
    schemaId: "${schemaIds[0]}",
    seqNo: 2668238,
    credentialDefinitionId: "${credentialDefinitionIds[0]}",
  };`;

    const sellerLicenseString = `export const sellerLicenseCredentialInfo = {
    schema: SELLER_LICENSE_SCHEMA,
    schemaId: "${schemaIds[1]}",
    seqNo: 2668240,
    credentialDefinitionId: "${credentialDefinitionIds[1]}",
  };`;

    const receiptString = `export const receiptCredentialInfo = {
    schema: RECEIPT_SCHEMA,
    schemaId: "${schemaIds[2]}",
    seqNo: 2668161,
    credentialDefinitionId: "${credentialDefinitionIds[2]}",
  };`;

    const output = `${nidString}\n${sellerLicenseString}\n${receiptString}`;

    console.log(output);

    return jsonOutput;
  } catch (error) {
    console.error("Error creating schema and credential definition:", error);
    return {
      schemaIds: [],
      credentialDefinitionIds: [],
    };
  }
}

createSchemaAndCredDef();
