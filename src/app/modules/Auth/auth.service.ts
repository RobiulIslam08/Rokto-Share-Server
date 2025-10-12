import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './auth.interface';
import { User } from './auth.model';
import jwt from 'jsonwebtoken';
import config from '../../config';
const loginUser = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password as string,
    user.password as string,
  );
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };
   if (!config.jwt_access_secret) {
    throw new Error('JWT Access Secret is not defined in the configuration!');
  }
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret, // এখানে 'as string' আর প্রয়োজন নেই
    {
      expiresIn: config.jwt_access_expires_in,
    },
  );
};
