import Url from '../models/Url.js';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random alphanumeric code of specified length.
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} Random short code
 */
export const generateRandomCode = (length = 6) => {
  let result = '';
  const charactersLength = CHARACTERS.length;
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Generates a unique short code checking MongoDB for collisions.
 * @param {number} length - Desired code length
 * @returns {Promise<string>} Unique short code
 */
export const generateUniqueShortCode = async (length = 6) => {
  let isUnique = false;
  let shortCode = '';
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    shortCode = generateRandomCode(length);
    const existingUrl = await Url.findOne({ shortCode });
    if (!existingUrl) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    // Fallback to timestamp prefix or 8 characters if collisions persist
    shortCode = generateRandomCode(8);
  }

  return shortCode;
};

export default generateUniqueShortCode;
