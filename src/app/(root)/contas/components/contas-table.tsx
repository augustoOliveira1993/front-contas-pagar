"use client";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { MODAL_KEYS } from "@/root/users/constants/modal-keys";
import { ContaForm } from "./conta-form";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { PlusIcon } from "lucide-react";
import { ContaColumns } from "./contas-columns";
import { useMemo } from "react";
import { useFetch } from "@/hooks/use-crud";
import { IContaDTO } from "../interfaces/index";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ContasConfirmDelete } from "./contas-confirm-delete";

export const ContaTable = () => {
  const { data: queryData } = useFetch<IContaDTO[]>({
    route: "/contas",
    queryKey: ["contas"],
  });
  const columns = useMemo(() => ContaColumns(), []);
  return (
    <div>
      <DataTable
        data={queryData || []}
        columns={columns || []}
        toolbar={(table) => (
          <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
            <ContaFormModal />
            <DataTableColumnsToggle table={table} className="bg-card" />
            <ContasConfirmDelete />
          </div>
        )}
      />
    </div>
  );
};
export const ContaFormModal = () => {
  const modal = useModalInstance(MODAL_KEYS.CREATE_USER);
  return (
    <Drawer open={modal.open} onOpenChange={modal.onOpenChange}>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-1 mr-auto">
          <PlusIcon className="w-4 h-4" />
          <span>Novo Conta</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent closeHandleClasses="bg-primary">
        <DrawerHeader className="items-start px-10 bg-muted-foreground/10 -mt-6 -z-10 rounded-b-4xl">
          <DrawerTitle>Cadastro de Usuários</DrawerTitle>
          <DrawerDescription>
            Preencha os dados abaixo para criar um novo usuário.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid px-10 overflow-y-auto">
          <ContaForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
