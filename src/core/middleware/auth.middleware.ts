// src/core/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe'; // Use the actual container if different
import {
  IJwtService,
  IJwtPayload,
  IJwtServiceMeta,
} from '@core/services/jwt.service';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import setCookieParser from 'set-cookie-parser'; // Import set-cookie-parser if needed

// Extend Express Request type to include 'user' using module augmentation
declare module 'express' {
  interface Request {
    user?: IJwtPayload; // Attach JWT payload to req.user
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get token from header

    const parsedSetCookie = setCookieParser.parse(req.headers.cookie || '');

    const access_token = parsedSetCookie.find((c) => c.name === 'access_token');
    if (access_token?.value) {
      req.headers.authorization = `Bearer ${access_token.value}`;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided.');
    }
    const token = authHeader.split(' ')[1];

    // 2. Resolve JWT service
    const jwtService = container.resolve<IJwtService>(IJwtServiceMeta.name);

    // 3. Verify token
    const payload = jwtService.verify(token);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token.');
    }

    // 4. Attach payload to request object
    req.user = payload;
    console.log(req.user); // Debugging line to check the payload

    // 5. Call next middleware/handler
    next();
  } catch (error) {
    // Catch specific errors or pass general errors
    if (error instanceof UnauthorizedError) {
      next(error);
    } else if (
      error instanceof Error &&
      (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
    ) {
      next(new UnauthorizedError('Invalid or expired token.'));
    } else {
      // Pass unexpected errors to global error handler
      next(error);
    }
  }
};
