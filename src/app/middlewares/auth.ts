// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import { TUserRole } from '../modules/User/user.interface';
// import { User } from '../modules/User/user.model';
// import catchAsync from '../utils/catchAsync';

// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//     }

//     // checking if the given token is valid
//     const decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//     ) as JwtPayload;

//     const { role, userId, iat } = decoded;

//     // checking if the user is exist
//     const user = await User.isUserExistsByCustomId(userId);

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//     }
//     // checking if the user is already deleted

//     const isDeleted = user?.isDeleted;

//     if (isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//     }

//     // checking if the user is blocked
//     const userStatus = user?.status;

//     if (userStatus === 'blocked') {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
//     }

//     if (
//       user.passwordChangedAt &&
//       User.isJWTIssuedBeforePasswordChanged(
//         user.passwordChangedAt,
//         iat as number,
//       )
//     ) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
//     }

//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'You are not authorized  hi!',
//       );
//     }

//     req.user = decoded as JwtPayload & { role: string };
//     next();
//   });
// };

// export default auth;


// src/app/middlewares/auth.ts
// src/app/middlewares/auth.ts
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';

// Request type extend করুন


const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Authorization header থেকে token নিন
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Token verify করুন
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }

    // req.user তে decoded data set করুন
    req.user = decoded as JwtPayload & { userId: string; role: string };

    // Role check করুন
    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to access this resource'
      );
    }

    next();
  });
};

export default auth;