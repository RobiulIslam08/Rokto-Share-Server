// src/app/modules/User/user.interface.ts
import { Types } from 'mongoose';

export interface ILocation {
  division: string;
  district: string;
  upazila: string;
}

export interface IUserProfile {
  user: Types.ObjectId;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  age: number;
  weight: number;
  location: ILocation;
  isAvailable: boolean;
  lastDonationDate?: Date;
  medicalHistory?: string;
  previousDonations: number;
  rating?: number;
  totalDonations?: number;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}