import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './auth.interface';
import { User } from './auth.model';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';
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
    userId: user?.id,
    role: user?.role,
  };
    const accessToken = createToken(jwtPayload,config.jwt_access_secret as string,config.jwt_access_expires_in as string)

	const loggedInUser = await User.findOne({email: payload.email});

    return {
      accessToken,
      user: loggedInUser
    };
};
