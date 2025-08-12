import bcrypt from 'bcrypt';
const ROUNDS = 12;

export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
export const checkPassword = (plain, hash) => bcrypt.compare(plain, hash);
