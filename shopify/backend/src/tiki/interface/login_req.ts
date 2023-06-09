export interface TikiLoginReq {
  grant_type: String;
  client_id: String;
  subject_token: String;
  subject_token_type: String;
  scope: String;
}
