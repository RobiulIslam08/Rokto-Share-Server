// src/app/modules/Donor/donor.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserProfile } from '../User/user.model';
import { User } from '../Auth/auth.model';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllDonorsFromDB = async (query: Record<string, unknown>) => {
  // Search করার জন্য searchable fields
  const donorSearchableFields = ['name', 'email', 'phone'];

  // QueryBuilder দিয়ে filtering করুন
  const donorQuery = new QueryBuilder(
    UserProfile.find({ isAvailable: true })
      .populate({
        path: 'user',
        select: 'name email phone avatar createdAt',
      }),
    query
  )
    .search(donorSearchableFields) // name দিয়ে search
    .filter() // bloodGroup, division, district, availability দিয়ে filter
    .sort()
    .paginate()
    .fields();

  const result = await donorQuery.modelQuery;
  const meta = await donorQuery.countTotal();

  // Data transform করুন frontend এর জন্য
  const transformedData = result.map((profile: any) => ({
    id: profile._id,
    name: profile.user?.name,
    email: profile.user?.email,
    phone: profile.user?.phone,
    avatar: profile.user?.avatar || '/placeholder.svg?height=40&width=40',
    bloodGroup: profile.bloodGroup,
    location: profile.location,
    age: profile.age,
    weight: profile.weight,
    isAvailable: profile.isAvailable,
    lastDonation: profile.lastDonationDate,
    rating: profile.rating || 4.5,
    totalDonations: profile.previousDonations || 0,
    verified: profile.verified || true,
  }));

  return {
    meta,
    data: transformedData,
  };
};



export const DonorServices = {
  getAllDonorsFromDB,
  getSingleDonorFromDB,
};