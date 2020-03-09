export interface IGCredential {
  id?: any;
  access_token: string;
  refresh_token: string;
  id_token: string;
  expiry_date: number,
  token_type: string
}
