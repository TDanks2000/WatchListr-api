export interface RegisterUser {
  name?: string;
  email: string;
  username: string;
  hashedPassword: string;
  accessToken?: string | undefined;
}

export interface LoginUser {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}
