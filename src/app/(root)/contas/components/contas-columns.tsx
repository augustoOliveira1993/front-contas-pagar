import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  DollarSignIcon,
  EditIcon,
  HashIcon,
  NewspaperIcon,
  TrashIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";
import { Highlight } from "@/components/extensions/search-highlight";
import { EContaStatus, EContaTipo, IContaDTO } from "../interfaces/index";
import { MODAL_KEYS } from "../constants/modal-keys";
import { cn, formatCurrency } from "@/lib/utils";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filterFnDate(row: any, columnId: string, value: string) {
  const date = row?.getValue(columnId);
  if (!date) return false;

  return formatDate(date).includes(value);
}

function ActionsColumn({ row }: { row: IContaDTO }) {
  const { onOpen, onClose } = useModalInstance<IContaDTO>(
    MODAL_KEYS.CREATE_USER
  );
  const { onOpen: onConfirmDelete, onClose: onCloseConfirmDelete } =
    useModalInstance(MODAL_KEYS.DELETE_USER);

  function handleUpdate() {
    onOpen(row);
  }

  function handleDelete() {
    onConfirmDelete({
      ...row,
      title: "delete",
    });
  }

  return (
    <div className="flex justify-end items-center gap-1 text-muted-foreground">
      <Button onClick={handleUpdate} size={"icon"} variant={"ghost"}>
        <EditIcon className="w-4 h-4" />
        <span className="sr-only">Editar</span>
      </Button>

      <Button
        onClick={handleDelete}
        size={"icon"}
        variant={"ghost"}
        className="hover:text-red-500"
      >
        <span className="sr-only">Excluir</span>
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Mapeamento de status
const getStatusIcon = (status: EContaStatus) => {
  switch (status) {
    case EContaStatus.PENDENTE:
      return { icon: Clock, color: "text-yellow-500" };
    case EContaStatus.PAGO:
      return { icon: CheckCircle, color: "text-green-600" };
    case EContaStatus.ATRASADO:
      return { icon: XCircle, color: "text-red-600" };
    case EContaStatus.PARCIAL:
      return { icon: AlertTriangle, color: "text-orange-500" };
    default:
      return { icon: Info, color: "text-gray-400" };
  }
};

// Mapeamento de tipo
const getTipoIcon = (tipo: EContaTipo) => {
  switch (tipo) {
    case EContaTipo.FIXA:
      return { icon: Calendar, color: "text-blue-600" };
    case EContaTipo.VARIAVEL:
      return { icon: DollarSign, color: "text-purple-600" };
    case EContaTipo.PARCELADA:
      return { icon: Clock, color: "text-pink-500" };
    case EContaTipo.RECORRENTE:
      return { icon: Calendar, color: "text-cyan-600" };
    default:
      return { icon: Info, color: "text-gray-400" };
  }
};

export const ContaColumns = (): ColumnDef<IContaDTO>[] => {
  return [
    {
      accessorKey: "codigo",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Codigo"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("codigo");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem nome
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <HashIcon className="size-4 text-muted-foreground" />
            <Highlight className="font-semibold" search={filterValue}>
              {value}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "descricao",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Descricao"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("descricao");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem descrição
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <Highlight className="font-semibold" search={filterValue}>
              {value}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "valor_total",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Valor Total"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<number>("valor_total");
        const filterValue = cell.column.getFilterValue() as number;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem descrição
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <DollarSignIcon className="size-4 text-muted-foreground" />
            <Highlight className="font-semibold" search={String(filterValue)}>
              {formatCurrency(value)}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Status"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("status");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem status
            </span>
          );

        const { icon: Icon, color } = getStatusIcon(value as EContaStatus);
        return (
          <div className="flex items-center gap-2">
            <Icon className={cn("size-4 text-muted-foreground", color)} />
            <Highlight className="font-semibold" search={filterValue}>
              {value}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "tipo",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Tipo"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("tipo");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem tipo
            </span>
          );
        const { icon: Icon, color } = getTipoIcon(value as EContaTipo);
        return (
          <div className="flex items-center gap-2">
            <Icon className={cn("size-4 text-muted-foreground", color)} />
            <Highlight className="font-semibold" search={filterValue}>
              {value}
            </Highlight>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Criado em"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("createdAt");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem data de criação
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <Highlight search={filterValue}>{formatDate(value)}</Highlight>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        return filterFnDate(row, columnId, value);
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Atualizado em"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("updatedAt");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem data de atualização
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <Highlight search={filterValue}>{formatDate(value)}</Highlight>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        return filterFnDate(row, columnId, value);
      },
    },
    {
      size: 20,
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-b-none border-l-0"
          column={column}
          title="Ações"
        />
      ),
      meta: {
        cellClassName: "!max-w-24 justify-center",
      },
      cell: ({ row, cell }) => {
        const value = row.original;
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem atualizador
            </span>
          );

        return <ActionsColumn row={value} />;
      },
    },
  ];
};
