"use server";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/axios-instance";
import { loginSchema } from "../schemas/login-schema";
import { sessionConfig } from "@/config/session-config";
import { clearCacheNavegador } from "@/lib/session/utils";
import { createSessionToken } from "@/lib/session/server";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const validation = loginSchema.safeParse({
    email,
    password,
  });

  if (!validation.success) {
    clearCacheNavegador(false);
    throw new Error(validation.error.message);
  }

  clearCacheNavegador(false);
  const response: any = await api
    .post("/auth/signin", {
      email,
      password,
    })
    .then(async (response) => {
      (await cookies()).set(sessionConfig.TOKEN_NAME, response.data.token);
      (await cookies()).set(
        sessionConfig.REFRESH_TOKEN_NAME,
        response.data.refreshToken
      );

      await createSessionToken({
        user: {
          email: response.data.email,
          username: response.data.username,
          isAdmin: response.data.isAdmin,
          pagina_inicial: response.data.pagina_inicial,
          _id: response.data._id,
          setor: response.data.setor,
          status: response.data.status,
        },
      });
      return {
        success: true,
        user: {
          email: response.data.email,
          username: response.data.username,
          roles: response.data.roles,
          permissions: response.data.permissions,
          isAdmin: response.data.isAdmin,
          ability: response.data.ability,
          pagina_inicial: response.data.pagina_inicial,
        },
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      };
    })
    .catch((error: any) => {
      if (isAxiosError(error)) {
        return {
          error: error?.response?.data.message,
        };
      }

      return {
        error: "E-mail ou senha inválidos",
      };
    });
  if (response.error) {
    return {
      success: false,
      error: response.error,
    };
  }

  const paginaInicial = response?.user?.pagina_inicial;
  if (paginaInicial.trim() !== "") {
    redirect(
      paginaInicial.startsWith("/") ? paginaInicial : `/${paginaInicial}`
    );
  } else {
    redirect("/");
  }
}
