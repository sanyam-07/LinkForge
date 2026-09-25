/**
 * Helper to securely retrieve the JWT Secret from environment variables
 * Throws a fatal configuration error in production if JWT_SECRET is missing.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is not defined in production environment.');
    }
    return 'linkforge_dev_jwt_secret_key_987654321_secure';
  }
  return secret;
};

export default getJwtSecret;
