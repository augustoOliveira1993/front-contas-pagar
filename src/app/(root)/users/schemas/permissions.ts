import z from "zod";

export const permissionsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  role: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .nonempty("Por favor selecione ao menos 1 opção"),
  permissao_grupos: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .nonempty("Por favor selecione ao menos 1 opção"),
});

export type IPermissionsSchema = z.infer<typeof permissionsFormSchema>;
