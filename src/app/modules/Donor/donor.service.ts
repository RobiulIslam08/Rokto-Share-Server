// // src/app/modules/Donor/donor.service.ts
// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { UserProfile } from '../User/user.model';
// import { User } from '../Auth/auth.model';
// import QueryBuilder from '../../builder/QueryBuilder';

// const getAllDonorsFromDB = async (query: Record<string, unknown>) => {
//   // Search করার জন্য searchable fields
//   const donorSearchableFields = ['name', 'email', 'phone'];

//   // QueryBuilder দিয়ে filtering করুন
//   const donorQuery = new QueryBuilder(
//     UserProfile.find({ isAvailable: true })
//       .populate({
//         path: 'user',
//         select: 'name email phone avatar createdAt',
//       }),
//     query
//   )
//     .search(donorSearchableFields) // name দিয়ে search
//     .filter() // bloodGroup, division, district, availability দিয়ে filter
//     .sort()
//     .paginate()
//     .fields();

//   const result = await donorQuery.modelQuery;
//   const meta = await donorQuery.countTotal();

//   // Data transform করুন frontend এর জন্য
//   const transformedData = result.map((profile: any) => ({
//     id: profile._id,
//     name: profile.user?.name,
//     email: profile.user?.email,
//     phone: profile.user?.phone,
//     avatar: profile.user?.avatar || '/placeholder.svg?height=40&width=40',
//     bloodGroup: profile.bloodGroup,
//     location: profile.location,
//     age: profile.age,
//     weight: profile.weight,
//     isAvailable: profile.isAvailable,
//     lastDonation: profile.lastDonationDate,
//     rating: profile.rating || 4.5,
//     totalDonations: profile.previousDonations || 0,
//     verified: profile.verified || true,
//   }));

//   return {
//     meta,
//     data: transformedData,
//   };
// };

// const getSingleDonorFromDB = async (id: string) => {
//   const donor = await UserProfile.findById(id).populate({
//     path: 'user',
//     select: 'name email phone avatar createdAt',
//   });

//   if (!donor) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Donor not found!');
//   }

//   // Transform data
//   const transformedData = {
//     id: donor._id,
//     name: (donor.user as any)?.name,
//     email: (donor.user as any)?.email,
//     phone: (donor.user as any)?.phone,
//     avatar: (donor.user as any)?.avatar || '/placeholder.svg?height=40&width=40',
//     bloodGroup: donor.bloodGroup,
//     location: donor.location,
//     age: donor.age,
//     weight: donor.weight,
//     isAvailable: donor.isAvailable,
//     lastDonation: donor.lastDonationDate,
//     rating: donor.rating || 4.5,
//     totalDonations: donor.previousDonations || 0,
//     verified: donor.verified || true,
//     medicalHistory: donor.medicalHistory,
//   };

//   return transformedData;
// };

// export const DonorServices = {
//   getAllDonorsFromDB,
//   getSingleDonorFromDB,
// };