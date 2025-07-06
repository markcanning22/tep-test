import { randomBytes, scrypt } from 'node:crypto';

export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }

      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};
