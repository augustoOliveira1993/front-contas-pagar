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
import { IModulesSchema, modulesFormSchema } from "../../../schemas/modules";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function ModulesForm() {
  const { mutate: create } = useCreate({
    route: "/permissao-grupos",
    mutationKey: ["create-modules"],
    queryInvalidationKeys: ["modules"],
  });
  const { mutate: update } = useUpdate({
    route: "/permissao-grupos",
    mutationKey: ["create-modules"],
    queryInvalidationKeys: ["modules"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_MODULE);
  const form = useForm<IModulesSchema>({
    resolver: zodResolver(modulesFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open && updateData) {
      form.reset(updateData);
    }
  }, [open, updateData]);

  const onSubmit = (formData: IModulesSchema) => {
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
        <SheetTitle>{updateData ? "Editar" : "Criar"} Modulo</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para o{" "}
          {updateData ? "modulo existente" : "novo modulo"}.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome da modulo..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  O nome da modulo deve ser único e descritivo.
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
