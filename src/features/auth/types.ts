export type User = {
  id: number;
  username: string;
  email: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};