import { Model } from "mongoose";

export type TUserRole = 'user' | 'donor' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: TUserRole;
  passwordChangedAt?: Date;
};
export type TUserModel = Model<TUser> & {
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
};