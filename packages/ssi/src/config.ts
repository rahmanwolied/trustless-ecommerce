export const ACAPY_API_URL = "http://172.17.0.1:8021";

export const DEFAULT_INVITATION_BODY = {
  accept: ["didcomm/aip1", "didcomm/aip2;env=rfc19"],
  alias: "NID VC Issuer",
  goal: "To issue a Valid NID credential",
  goal_code: "issue-vc",
  handshake_protocols: ["https://didcomm.org/didexchange/1.0"],
  my_label: "NID VC Issuer",
};

export const NID_SCHEMA = {
  name: "NID",
  attributes: [
    "first_name",
    "last_name",
    "date_of_birth",
    "gender",
    "address",
    "phone_number",
    "nid_number",
  ],
  version: "2.0",
  tag: "NID",
} as const;

export const RECEIPT_SCHEMA = {
  name: "Receipt",
  attributes: ["receipt_number", "receipt_date", "receipt_amount"],
  version: "2.1",
  tag: "Receipt",
} as const;

export const SELLER_LICENSE_SCHEMA = {
  name: "Seller License",
  attributes: [
    "company_name",
    "company_address",
    "tin",
    "phone_number",
    "type",
    "seller_nid_number",
    "seller_first_name",
    "seller_last_name",
  ],
  version: "2.1",
  tag: "Seller License",
} as const;

export interface SchemaAttributes {
  name: string;
  attributes: string[];
  version: string;
  tag: string;
}
