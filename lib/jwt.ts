import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "access_secret_12345";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_67890";

// Sign Access Token (Expires in 15 minutes)
export const signAccessToken = (payload: { id: number; email: string }) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

// Sign Refresh Token (Expires in 7 days)
export const signRefreshToken = (payload: { id: number; email: string }) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

// Verify Access Token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as { id: number; email: string };
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as { id: number; email: string };
};
