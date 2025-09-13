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
import {
  IPermissionsSchema,
  permissionsFormSchema,
} from "../../../schemas/permissions";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { IRoles } from "../../../interfaces/roles";
import { IModules } from "../../../interfaces/modules";
import { Badge } from "@/components/ui/badge";

export function PermissionsForm() {
  const { mutate: create } = useCreate({
    route: "/permissoes",
    mutationKey: ["create-permissions"],
    queryInvalidationKeys: ["permissions"],
  });
  const { mutate: update } = useUpdate({
    route: "/permissoes",
    mutationKey: ["create-permissions"],
    queryInvalidationKeys: ["permissions"],
  });
  const { data: optionsRoles, isPending: pendingRoles } = useFetch<IRoles[]>({
    route: "/roles",
    queryKey: ["options-roles"],
  });
  const { data: optionsModules, isPending: pendingModules } = useFetch<
    IModules[]
  >({
    route: "/permissao-grupos",
    queryKey: ["options-modules"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_PERMISSION);
  const form = useForm<IPermissionsSchema>({
    resolver: zodResolver(permissionsFormSchema),
    defaultValues: {
      name: "",
      role: [],
      permissao_grupos: [],
    },
  });

  useEffect(() => {
    if (open && updateData) {
      form.reset(updateData);
    }
  }, [open, updateData]);

  const onSubmit = (data: IPermissionsSchema) => {
    if (updateData) {
      // Para edição, mantém o comportamento original
      const formData = {
        name: data.name,
        role: data?.role?.map((rl) => rl.value),
        permissao_grupos: data?.permissao_grupos?.map((md) => md.value),
      };
      update({ formData, id: updateData._id });
    } else {
      // Para criação, cria uma permissão para cada grupo selecionado
      const createPromises = data.permissao_grupos.map((grupo) => {
        const completedName = `${grupo.label}:${data.name}`;
        const formData = {
          name: completedName,
          role: data?.role?.map((rl) => rl.value),
          permissao_grupos: [grupo.value],
        };
        return create({ formData });
      });

      Promise.all(createPromises);
    }
    onClose();
    form.reset();
  };

  console.log("optionsROles", optionsRoles);
  const permissionWatch = form.watch("name");
  const modulesWatch = form.watch("permissao_grupos");

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Permissão</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para a{" "}
          {updateData ? "permissão existente" : "nova permissão"}.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-6"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Roles </FormLabel>
                <MultiSelector
                  onValuesChange={field.onChange}
                  values={field.value}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Selecione..." />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {pendingRoles
                        ? null
                        : optionsRoles?.map((user: IRoles) => (
                            <MultiSelectorItem
                              key={user.name}
                              value={user.name}
                              label={user.name}
                            >
                              <span>{user.name}</span>
                            </MultiSelectorItem>
                          ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
                <FormDescription>Selecione ao menos uma role</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permissao_grupos"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Modulos (Grupo de Permissões) </FormLabel>
                <MultiSelector
                  onValuesChange={field.onChange}
                  values={field.value}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Selecione..." />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {pendingModules
                        ? null
                        : optionsModules?.map((user: IModules) => (
                            <MultiSelectorItem
                              key={user.name}
                              value={user.name}
                              label={user.name}
                            >
                              <span>{user.name}</span>
                            </MultiSelectorItem>
                          ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
                <FormDescription>
                  Selecione ao menos um modulo que deseja atribuir essa
                  permissão.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            disabled={!modulesWatch?.length}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="exemplo: 'ver' | 'excluir' | 'editar' | outra... "
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  O nome da permissão deve ser único e descritivo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {permissionWatch?.length > 0 && (
            <fieldset className="border-dashed bg-accent/20 border p-2 rounded-md">
              <legend className="text-muted-foreground italic text-sm">
                Pré-visualização
              </legend>
              <div className="flex flex-wrap gap-1">
                {modulesWatch?.map((mod, idx) => {
                  return (
                    <Badge
                      key={mod.value + idx}
                      className="gap-1"
                    >
                      <span className="text-primary-foreground/60">
                        {mod.label}
                      </span>
                      <span className="font-bold">:</span>
                      <span className="">{permissionWatch}</span>
                    </Badge>
                  );
                })}
              </div>
            </fieldset>
          )}

          <Button
            type="submit"
            className="w-full"
          >
            {updateData ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
