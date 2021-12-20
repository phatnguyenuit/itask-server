import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Generate salt
 * @returns {Promise<string>} Salt
 */
const generateSalt = () => bcrypt.genSalt(saltRounds);

/**
 * Encrypt password
 * @param {string} plainText Plain text password
 * @returns {string} encrypted password
 */
export const encrypt = async (plainText: string) => {
  const salt = await generateSalt();
  const hash = await bcrypt.hash(plainText, salt);

  return hash;
};

/**
 * Verify password
 * @param {string} plainText Plain text password
 * @param {string} hash hash password
 * @returns {boolean}
 */
export const verify = (plainText: string, hash: string) =>
  bcrypt.compare(plainText, hash);

//   Generate hash from input
const [text] = process.argv.slice(2);

if (text) {
  encrypt(text).then(console.log).catch(console.error);
}
