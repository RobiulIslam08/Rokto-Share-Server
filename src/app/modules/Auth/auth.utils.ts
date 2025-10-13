import jwt, { JwtPayload } from 'jsonwebtoken';
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: jwt.Secret,
  expiresIn: string | number,
): string => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as jwt.SignOptions); // Type assertion here
};

export const verifyToken = (token: string, secret: string) => {
 try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

