import { clearSession } from "./client";
import { SignJWT, jwtVerify } from "jose";
import { sessionConfig } from "@/config/session-config";

export const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET;
export const key = new TextEncoder().encode(secretKey);

export interface ISessionData {
  user: any;
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: sessionConfig.CONFIG_ALGORITMS_JWT })
    .setIssuedAt()
    .sign(key);
}

export async function encryptNoExpire(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: sessionConfig.CONFIG_ALGORITMS_JWT })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: [sessionConfig.CONFIG_ALGORITMS_JWT],
    });
    return payload;
  } catch (error) {
    clearSession();
    return false;
  }
}

export const clearCacheNavegador = (isReload: boolean = false) => {
  if (typeof window === "undefined") return; // Garante que está rodando no navegador

  // 🧹 Limpar localStorage e sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // 🧹 Limpar cookies
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // 🧹 Limpar cache (se suportado)
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }

  // 🛑 Cancelar todos os setTimeout e setInterval ativos
  const highestTimeoutId = setTimeout(() => {}, 0) as unknown as number;
  for (let i = 0; i <= highestTimeoutId; i++) {
    clearTimeout(i);
    clearInterval(i);
  }

  console.log("✅ Todos os dados e processos foram limpos!");

  // 🔄 Recarregar a página após a limpeza
  if (isReload) {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};

export function parseExpirationTime(
  expiration: string | number,
  unitType: "seconds" | "milliseconds" = "seconds"
): number {
  const timeUnits: { [key: string]: number } = {
    s: unitType === "milliseconds" ? 1000 : 1, // segundos
    m: unitType === "milliseconds" ? 1000 * 60 : 60, // minutos
    h: unitType === "milliseconds" ? 1000 * 60 * 60 : 3600, // horas
    d: unitType === "milliseconds" ? 1000 * 60 * 60 * 24 : 86400, // dias
  };

  if (typeof expiration === "number") {
    return unitType === "milliseconds" && expiration >= 1000
      ? expiration
      : Math.floor(expiration); // retorna sempre em segundos ou milissegundos diretamente
  }

  const match = expiration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      'Formato inválido. Use algo como "10s", "5m", "2h", ou "1d".'
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  return value * timeUnits[unit]; // Retorna o valor em milissegundos ou segundos
}
