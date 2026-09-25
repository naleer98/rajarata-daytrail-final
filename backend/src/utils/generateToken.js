import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for an authenticated user.
 * @param {string} id - The MongoDB user ID.
 * @param {string} role - The user role ('tourist' or 'admin').
 * @returns {string} Signed JWT token string.
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;