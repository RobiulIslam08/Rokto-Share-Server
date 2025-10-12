import { Types } from 'mongoose';

export type TLocation = {
  division: string;
  district: string;
  upazila: string;
};

export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TUserProfile = {
  user: Types.ObjectId;
  bloodGroup: TBloodGroup;
  age: number;
  weight: number;
  location: TLocation;
  isAvailable: boolean;
  lastDonationDate?: string;
  medicalHistory?: string;
  previousDonations: number;
};
