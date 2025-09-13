import z from "zod";

export const rolesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export type IRolesSchema = z.infer<typeof rolesFormSchema>;
