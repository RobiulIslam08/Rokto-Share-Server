import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './auth.interface';
import { User } from './auth.model';

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
};
