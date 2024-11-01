import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

interface TokenPayload {
  challengeId: string;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET_KEY) as TokenPayload;
}

export function generateToken(challengeId: string): string {
  const payload: TokenPayload = { challengeId };
  return jwt.sign(payload, SECRET_KEY);
}
