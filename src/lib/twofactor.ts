import "server-only";
import { TOTP, Secret } from "otpauth";
import QRCode from "qrcode";

const ISSUER = "Indibiz Admin";

export function generateTwoFactorSecret() {
  const secret = new Secret({ size: 20 });
  return secret.base32;
}

function buildTotp(email: string, base32Secret: string) {
  return new TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(base32Secret),
  });
}

export async function generateQrCodeDataUrl(email: string, base32Secret: string) {
  const totp = buildTotp(email, base32Secret);
  return QRCode.toDataURL(totp.toString());
}

export function verifyTwoFactorCode(email: string, base32Secret: string, code: string) {
  const totp = buildTotp(email, base32Secret);
  // window: 1 => menoleransi pergeseran waktu ±30 detik
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
