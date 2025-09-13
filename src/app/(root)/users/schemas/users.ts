import z from "zod";

const optionsMultiSelect = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
  })
);

const modulesWithPermissions = z.object({
  permissions: optionsMultiSelect,
});

export const usersFormSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  roles: z.array(z.string().nonempty("Por favor selecione ao menos 1 opção")),
  modules: z.array(modulesWithPermissions),
  avatar_url: z.string().optional(),
  setor: z.string().optional(),
  pagina_inicial: z.string().optional(),
  status: z.enum(["ATIVO", "INATIVO"]).optional(),
  tempo_expiracao_token: z.string().optional(),
});

export type IUsersSchema = z.infer<typeof usersFormSchema>;
