export type TUserRole = 'user' | 'donor' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: TUserRole;
  passwordChangedAt?: Date;
};
