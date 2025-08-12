import crypto from 'crypto';

const KEY_HEX = process.env.INIT_PWD_KEY; // 64 hex chars for 32 bytes (AES-256)
if (!KEY_HEX || KEY_HEX.length !== 64) {
  console.warn('[WARN] INIT_PWD_KEY missing or wrong length; generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
}
const KEY = Buffer.from(KEY_HEX || '0'.repeat(64), 'hex');

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([enc, tag]).toString('base64'),
    iv: iv.toString('base64')
  };
}

export function decrypt(ciphertext, iv) {
  const buf = Buffer.from(ciphertext, 'base64');
  const data = buf.slice(0, buf.length - 16);
  const tag = buf.slice(buf.length - 16);
  const ivBuf = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, ivBuf);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}
