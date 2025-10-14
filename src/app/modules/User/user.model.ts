import { Schema, model } from 'mongoose';
import { IUserProfile } from './user.interface';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const locationSchema = new Schema({
  division: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
}, {_id: false});

const userProfileSchema = new Schema<IUserProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bloodGroup: { type: String, enum: bloodGroups,required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    location: { type: locationSchema, required: true },
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: { type: String },
    medicalHistory: { type: String },
    previousDonations: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const UserProfile = model<IUserProfile>('UserProfile', userProfileSchema);