"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import { MODAL_KEYS } from "../constants/modal-keys";
import { IUsersSchema, usersFormSchema } from "../schemas/users";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { IPermissions } from "../interfaces/permissions";
import { IRoles } from "../interfaces/roles";
import { Switch } from "@/components/ui/switch";
import { SIDEBAR_PAGES } from "@/config/site-config";
import { ISelectRoles } from "../interfaces/users";

function groupPermissionsByGroup(permissions: any[]) {
  const groupsMap = new Map();

  permissions?.forEach((permission) => {
    permission.permissao_grupos?.forEach((group: any) => {
      if (!groupsMap.has(group._id)) {
        groupsMap.set(group._id, {
          _id: group._id,
          name: group.name,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          permissions: [],
        });
      }

      groupsMap.get(group._id).permissions.push({
        _id: permission._id,
        name: permission.name,
        roles: permission.roles,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      });
    });
  });

  return Array.from(groupsMap.values());
}

export function UsersForm() {
  const { data: optionsPermissions } = useFetch<IPermissions[]>({
    queryKey: ["options-permissions"],
    route: "/permissoes",
  });
  const { data: optionsRoles } = useFetch<IRoles[]>({
    queryKey: ["options-roles"],
    route: "/roles",
  });

  const { mutate: create } = useCreate({
    route: "/users",
    mutationKey: ["create-users"],
    queryInvalidationKeys: ["users"],
  });
  const { mutate: update } = useUpdate({
    route: "/users",
    mutationKey: ["create-users"],
    queryInvalidationKeys: ["users"],
  });

  const {
    data: updateData,
    onClose,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_USER);

  const form = useForm<IUsersSchema>({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      roles: [],
      modules: [],
      avatar_url: "",
      setor: "",
      pagina_inicial: "",
      status: "ATIVO",
      tempo_expiracao_token: "8h",
    },
  });

  console.log("form", form.formState.errors);

  useEffect(() => {
    if (open && updateData) {
      form.reset(updateData);
    }
  }, [open, updateData]);

  const onSubmit = (formData: IUsersSchema) => {
    if (updateData) {
      update({ formData, id: updateData._id });
    } else {
      create({ formData });
    }
    onClose();
    form.reset();
  };

  const groupedPermissions = groupPermissionsByGroup(optionsPermissions || []);

  console.log("formValues", form.getValues());

  const allPages = [
    ...SIDEBAR_PAGES.navMain,
    ...SIDEBAR_PAGES.navSecondary,
    ...SIDEBAR_PAGES.documents.map((item) => ({
      title: item.name,
      url: item.url,
    })),
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-6 p-4 grid grid-cols-[400px_1fr] gap-8"
      >
        <aside className="grid gap-y-3">
          <p className="text-muted-foreground text-sm leading-none font-medium">
            Informações do Usuário
          </p>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-2"
                    placeholder="Digite o nome de usuário..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-2"
                    placeholder="Digite o email..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-2"
                    placeholder="Digite o email..."
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <ToggleRoles
            changeRole={(id: string) => {
              const roles = form.getValues("roles");

              if (roles.includes(id)) {
                form.setValue(
                  "roles",
                  roles.filter((role) => role !== id)
                );
              }

              if (!roles.includes(id)) {
                form.setValue("roles", [...roles, id]);
              }
            }}
          />

          <p className="text-muted-foreground text-sm leading-none font-medium">
            Configurações do Sistema
          </p>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="grid border rounded-md bg-input/30 min-h-9 px-3 items-center grid-cols-3 gap-2 space-y-0">
                <FormLabel>
                  Status ({field.value === "ATIVO" ? "Ativo" : "Inativo"})
                </FormLabel>
                <FormControl>
                  <Switch
                    className="col-span-2 ml-auto"
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? "ATIVO" : "INATIVO");
                    }}
                    checked={field.value === "ATIVO"}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pagina_inicial"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel>Pagina Inicial</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-full col-span-2">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allPages.map((item) => (
                        <SelectItem key={item.title} value={item.title}>
                          {item.title}{" "}
                          <span className="text-muted-foreground">
                            {item.url}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setor"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-2"
                    placeholder="Digite o setor..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </aside>

        <main className="flex flex-col gap-6">
          <p className="text-muted-foreground text-sm leading-none font-medium">
            Escolha as permissões
          </p>

          <div className="flex flex-col gap-3">
            {groupedPermissions?.map((group) => (
              <FormField
                key={group._id}
                control={form.control}
                name={`modules.${group._id}.permissions`}
                render={({ field }) => {
                  return (
                    <FormItem className="w-full gap-0 grid grid-cols-[200px_1fr] rounded-lg border space-y-0">
                      <FormLabel className="text-right pl-3 rounded-l-md bg-muted capitalize justify-start">
                        {group.name}{" "}
                        <span className="text-muted-foreground text-xs">
                          ({group.permissions?.length || 0}) permissões
                        </span>
                      </FormLabel>
                      <MultiSelector
                        className="space-y-0"
                        onValuesChange={field.onChange}
                        values={field.value || []}
                      >
                        <MultiSelectorTrigger className="rounded-l-none">
                          <MultiSelectorInput placeholder="Selecione..." />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList className="mt-1.5">
                            {group.permissions.map((permission: any) => (
                              <MultiSelectorItem
                                key={permission._id}
                                value={permission._id}
                                label={permission.name}
                              >
                                <span className="ml-4">{permission.name}</span>
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </main>

        <footer className="py-4 bg-background left-0 ">
          <Button type="submit" className="w-full col-span-full">
            Cadastrar
          </Button>
        </footer>
      </form>
    </Form>
  );
}

export default function ToggleRoles({
  changeRole,
}: {
  changeRole: (id: string) => void;
}) {
  const id = useId();

  const { data: queryData } = useFetch<IRoles[]>({
    route: "/roles",
    queryKey: ["roles"],
  });
  const items: ISelectRoles[] = queryData?.map((item) => ({
    value: item._id,
    label: item.name,
    descricao: item.name === "Administrador" ? "Acesso completo" : "",
  })) as ISelectRoles[];

  return (
    <fieldset className="space-y-4 my-4">
      <legend className="text-muted-foreground text-sm leading-none font-medium">
        Escolha o papel (Role)
      </legend>
      <RadioGroup
        className="gap-0 -space-y-px rounded-md shadow-xs"
        defaultValue="2"
        onChange={(e: any) => {
          changeRole(e?.target.value);
        }}
      >
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className="border-input bg-input/30 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${id}-${item.value}`}
                  value={item.value}
                  className="after:absolute border-muted-foreground/50 after:inset-0"
                  aria-describedby={`${`${id}-${item.value}`}-price`}
                />
                <Label
                  className="inline-flex items-start"
                  htmlFor={`${id}-${item.value}`}
                >
                  {item.label}
                </Label>
              </div>
              <div
                id={`${`${id}-${item.value}`}-price`}
                className="text-muted-foreground text-xs leading-[inherit]"
              >
                {item.descricao}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
