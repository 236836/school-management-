// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, role, res) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   30 * 24 * 60 * 60 * 1000,
    path:     '/',
  });

  console.log('🍪 Cookie set for user:', userId);
  return token;
};