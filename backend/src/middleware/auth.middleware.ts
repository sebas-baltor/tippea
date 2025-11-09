import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"
import { ForbiddenException, UnauthorizedException } from '@/lib/exceptions';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
  createdAt: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedException(
      'Unauthorized: Invalid authorization header',
    );
  }

  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (error, user) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Unauthorized: Token has expired');
      }

      throw new ForbiddenException('Forbidden: Invalid token');
    }
    //@ts-ignore
    req.user = user as UserPayload;
    next();
  });
}
