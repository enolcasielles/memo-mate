import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

interface TokenPayload {
  userId: string;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET_KEY) as TokenPayload;
}

export function generateToken(userId: string, expiresIn: string): string {
  const payload: TokenPayload = { userId };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn
  });
}
