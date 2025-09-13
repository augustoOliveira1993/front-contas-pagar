import { parseCookies } from "nookies";
import { siteConfig } from "./site-config";
import { parseExpirationTime } from "@/lib/session/utils";

const mode = process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "dev";

const COMPANY_NAME = `${siteConfig.name}-${process.env.NEXT_PUBLIC_PORT_DASH}`;
export const CURRENT_VERSION = "v1.0.0";
export const key = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_AUTH_SECRET
);
export const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET;

export const sessionConfig = {
  SESSION_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:session`,
  TOKEN_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:auth.token`,
  ABILITIES: `@${COMPANY_NAME}-${CURRENT_VERSION}:abilities`,
  REFRESH_TOKEN_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:auth.refreshtoken`,
  CONFIG_SESSION_EXPIRES: parseExpirationTime("1d", "milliseconds"), // 1 dia
  CONFIG_TOKEN_EXPIRES: parseExpirationTime("1h", "milliseconds"), // 1 hora
  CONFIG_REFRESH_TOKEN_EXPIRES: parseExpirationTime("8h", "milliseconds"), // 8 horas
  CONFIG_EXPIRATION_TIME_JWT: "8 hours",
  CONFIG_ALGORITMS_JWT: "HS256",
  CONFIG_PATH: "/",
};

export async function getUser() {
  const cookies = parseCookies();
  const session = cookies[sessionConfig.SESSION_NAME];
  if (!session) return null;
  // ...
}
