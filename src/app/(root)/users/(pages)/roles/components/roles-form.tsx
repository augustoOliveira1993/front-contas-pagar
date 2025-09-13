"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../../constants/modal-keys";
import { IRolesSchema, rolesFormSchema } from "../../../schemas/roles";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function RolesForm() {
  const { mutate: create } = useCreate({
    route: "/roles",
    mutationKey: ["create-roles"],
    queryInvalidationKeys: ["roles"],
  });
  const { mutate: update } = useUpdate({
    route: "/roles",
    mutationKey: ["create-roles"],
    queryInvalidationKeys: ["roles"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_ROLE);
  const form = useForm<IRolesSchema>({
    resolver: zodResolver(rolesFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open && updateData) {
      form.reset(updateData);
    }
  }, [open, updateData]);

  const onSubmit = (formData: IRolesSchema) => {
    if (updateData) {
      update({ formData, id: updateData._id });
    } else {
      create({ formData });
    }
    onClose();
    form.reset();
  };

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Role</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para o{" "}
          {updateData ? "papel existente" : "novo papel"}.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-6 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome da role..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  O nome da role deve ser único e descritivo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
          >
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
}
