import z from "zod";

export const modulesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export type IModulesSchema = z.infer<typeof modulesFormSchema>;
