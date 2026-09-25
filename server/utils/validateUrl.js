import validator from 'validator';

/**
 * Validates whether a given string is a valid HTTP/HTTPS URL.
 * @param {string} urlInput 
 * @returns {object} { isValid: boolean, formattedUrl: string|null, error: string|null }
 */
export const validateUrl = (urlInput) => {
  if (!urlInput || typeof urlInput !== 'string' || !urlInput.trim()) {
    return { isValid: false, formattedUrl: null, error: 'URL cannot be empty' };
  }

  let trimmedUrl = urlInput.trim();

  // If user enters domain without protocol (e.g., example.com), prepend https://
  if (!/^https?:\/\//i.test(trimmedUrl)) {
    trimmedUrl = `https://${trimmedUrl}`;
  }

  const isUrlValid = validator.isURL(trimmedUrl, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
  });

  if (!isUrlValid) {
    return {
      isValid: false,
      formattedUrl: null,
      error: 'Please enter a valid URL (e.g. https://example.com)',
    };
  }

  try {
    const parsed = new URL(trimmedUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        formattedUrl: null,
        error: 'Only http and https protocols are supported',
      };
    }
  } catch (err) {
    return { isValid: false, formattedUrl: null, error: 'Malformed URL provided' };
  }

  return { isValid: true, formattedUrl: trimmedUrl, error: null };
};

export default validateUrl;
