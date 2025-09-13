export interface IUsers {
  username: string;
  email: string;
  password?: string;
  loja?: any;
  roles?: any[];
  permissaos?: any[];
  avatar_url?: string;
  setor?: string;
  pagina_inicial?: string;
  status?: "ATIVO" | "INATIVO";
  tempo_expiracao_token?: string;
  lojas_associadas?: any[];
}

export interface ISelectRoles {
  value: string;
  label: string;
  descricao: string;
}
