import axios from "axios";
import { toast } from "sonner";
import { parseCookies, setCookie } from "nookies";
import { clearCacheNavegador } from ".//session/utils";
import { sessionConfig } from "@/config/session-config";

const baseURL =
  process.env.APP_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_PROD_API_BASE_URL;

const token = parseCookies()[sessionConfig.TOKEN_NAME] || "";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "x-access-token": token,
  },
});

// Você pode adicionar interceptors aqui se necessário
axiosInstance.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers["x-access-token"] = token;
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
      config.headers.timeout = 20000;
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);

    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    // Qualquer código de status entre 2xx fará com que esta função seja acionada
    return response;
  },
  async (error: any) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          const cokkies = parseCookies();
          const refreshToken = cokkies[sessionConfig.REFRESH_TOKEN_NAME];
          if (refreshToken && !isRefreshing) {
            isRefreshing = true;

            return axiosInstance
              .post("/auth/refresh", { refreshToken })
              .then(async (res) => {
                const { token, refreshToken: newRefreshToken } = res.data;

                setCookie(null, sessionConfig.TOKEN_NAME, token, { path: "/" });
                setCookie(
                  null,
                  sessionConfig.REFRESH_TOKEN_NAME,
                  newRefreshToken,
                  { path: "/" }
                );

                axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
                axiosInstance.defaults.headers["x-access-token"] = token;

                failedRequestsQueue.forEach((req) => req.onSuccess(token));
                failedRequestsQueue = [];
                isRefreshing = false;

                error.config.headers.Authorization = `Bearer ${token}`;
                error.config.headers["x-access-token"] = token;
                return axiosInstance(error.config);
              })
              .catch((err) => {
                failedRequestsQueue.forEach((req) => req.onFailure(err));
                failedRequestsQueue = [];
                isRefreshing = false;
                clearCacheNavegador(true);
                toast.error(err?.response?.data?.title, {
                  description: err?.response?.data?.message,
                });
                return Promise.reject(err);
              });
          }
          // toast.error("Sessão expirada. Por favor, faça login novamente.");
          break;
        case 403:
          console.log(error)
          toast.error("Você não tem permissão para acessar este recurso.");
          break;
        case 404:
          toast.error("O recurso solicitado não foi encontrado.");
          break;
        case 500:
          toast.error("Erro interno do servidor. Tente novamente mais tarde.");
          break;
        default:
          toast.error(
            `Ocorreu um erro: ${response.data?.message || "Erro desconhecido"}`
          );
      }
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      toast.error(
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    } else if (error.code === "ERR_CANCELED") {
      // A requisição foi cancelada - não mostrar toast automático
      console.log("Requisição cancelada:", error.message);
      // Note: Removemos o toast automático pois o cancelamento pode ser intencional
      // O componente que cancelou pode decidir se quer mostrar uma mensagem ou não
    } else {
      console.log("Erro ao configurar a requisição:", error);
      // Algo aconteceu na configuração da requisição que acionou um erro
      toast.error("Erro ao configurar a requisição.");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as api };
