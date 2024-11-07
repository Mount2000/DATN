import "dotenv/config"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

export function validatePassword(password) {
  const minLength = 6;
  const maxLength = 50;
  const lengthCheck = new RegExp(`^.{${minLength},${maxLength}}$`);
  const hasNumber = /\d/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    !lengthCheck.test(password) ||
    !hasNumber.test(password) ||
    !hasUpperCase.test(password) ||
    !hasLowerCase.test(password) ||
    !hasSpecialCharacter.test(password)
  ) {
    return false;
  }

  return true;
};

export function createAccessToken(userId){
 return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" })
}

export function createRefreshToken(userId){
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

export function createOTP(){
  const otp = crypto.randomInt(1, 999999).toString().padStart(6, '0')
  const otpExpire = Date.now() + 5*60*1000
  return {otp, otpExpire}
}

export function createAuthSecret(){
  const secret = speakeasy.generateSecret({length:20})
  const secretBase32 = secret.base32
  const secretAscii = secret.ascii
  const qrcode = QRCode.toDataURL(secret.otpauth_url)
  const authSecret = {
    secretBase32,
    secretAscii,
    qrcode,
  }
  return authSecret
}

export function validate2FA({secretAscii, token}){
  const tokenValidate = speakeasy.totp.verify({
    secret: secretAscii,
    encoding: "ascii",
    token,
  })
  return tokenValidate
}

export function encryptData(data) {
  const secretKey = crypto.createHash('sha256').update(process.env.JWT_REGISTER_SECRET).digest();
  const algorithm = 'aes-256-cbc'; // AES encryption algorithm with CBC mode
  const iv = crypto.randomBytes(16); // Generate a random 16-byte IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted data, both necessary for decryption
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  }
}

// Function to decrypt data
export function decryptData(encryptedData, iv) {
  const secretKey = crypto.createHash('sha256').update(process.env.JWT_REGISTER_SECRET).digest()
  const algorithm = 'aes-256-cbc';
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted)
}