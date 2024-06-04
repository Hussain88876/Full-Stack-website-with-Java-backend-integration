import jwt from "jsonwebtoken";

/**
 * Verifies the given JWT token and gets the username from it. Throws an error if the JWT is invalid or expired, or there's
 * no username in the token.
 *
 * Feel free to use this function or modify it in your own programs (credit the author!).
 *
 * @param {string} token the token to verify
 *
 * @author Andrew Meads
 */
export function getUsernameFromJWT(token) {
  // Decode token; will throw an error if the token is invalid or expired.
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  
  if (!decoded.username) throw `JWT is valid but did not contain a username.`;
  
  return decoded.username;
}

export function getAdminStatusFromJWT(token) {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  
  if (decoded.isAdminString == null) throw `JWT is valid but did not contain admin status.`;
  return decoded.isAdminString;
}

/**
 * Creates a new JWT for the user with the given username, with the given expiry time (defaults to 24 hours).
 *
 * Ideally, the expiry time should match the expiry time of the HTTP-only cookie it will be stored in, but doesn't
 * matter too much if not (they will both be checked separately).
 *
 * Feel free to use this function or modify it in your own programs (credit the author!).
 *
 * @param {string} username the username
 * @param {string} expiresIn when this token expires (defaults to 24 hours)
 *
 * @author Andrew Meads
 */
export function createUserJWT(username, is_admin, expiresIn = "24h") {
  const isAdminString = is_admin ? '1' : '0';
  return jwt.sign({ username, isAdminString }, process.env.JWT_KEY, { expiresIn });
}
