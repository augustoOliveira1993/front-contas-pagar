import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { PinIcon, PinOffIcon } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  defaultPinned?: "left" | "right";
  canHiddenColumn?: boolean;
  disabledOnDefaltPined?: boolean; // Se true, desabilita as opções de pinagem se já estiver fixado
  hiddenColumnOnInit?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  defaultPinned,
  disabledOnDefaltPined = false,
  canHiddenColumn = true,
  hiddenColumnOnInit = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  useEffect(() => {
    if (defaultPinned) {
      column.pin(defaultPinned); // Define o pin com base na flag ao montar o componente
    }
  }, [defaultPinned, column]);

  useEffect(() => {
    if (hiddenColumnOnInit) {
      column.toggleVisibility(false); // Alterna a visibilidade da coluna ao montar o componente
    }
  }, [hiddenColumnOnInit, column]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {column.id === "actions" || column.id === "expander" ? (
            <div className={cn("flex w-full h-10", className)}></div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              tooltip={title}
              tooltipSide="top"
              tooltipDelay={500}
              className={cn(
                [
                  "h-10 flex w-full justify-between gap-2 uppercase rounded-none data-[state=open]:bg-accent focus-visible:ring-transparent",
                ],
                className
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {column.getIsPinned() && (
                  <PinIcon
                    className={cn(["ml-2 size-3.5 text-muted-foreground"])}
                  />
                )}
                <span className="text-ellipsis line-clamp-1">{title}</span>
                {column.getIsSorted() === "desc" ? (
                  <ArrowDownIcon className="ml-2 w-4 h-4" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUpIcon className="ml-2 w-4 h-4" />
                ) : (
                  <CaretSortIcon className="ml-auto w-4 h-4" />
                )}
              </div>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.id !== "actions" && (
            <>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                className={cn({
                  "text-muted-foreground": column.getIsSorted() !== "asc",
                  "text-blue-500": column.getIsSorted() === "asc",
                })}
              >
                <ArrowUpIcon className={cn(["mr-2 h-3.5 w-3.5"])} />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                className={cn({
                  "text-muted-foreground": column.getIsSorted() !== "desc",
                  "text-blue-500": column.getIsSorted() === "desc",
                })}
              >
                <ArrowDownIcon className="mr-2 w-3.5 h-3.5" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {canHiddenColumn && (
                <DropdownMenuItem onClick={() => column.toggleVisibility()}>
                  <EyeNoneIcon className="mr-2 w-3.5 h-3.5 text-muted-foreground" />
                  Hide
                </DropdownMenuItem>
              )}
            </>
          )}
          <DropdownMenuItem
            disabled={disabledOnDefaltPined}
            onClick={() => column.pin("right")}
            className={cn(["text-foreground flex justify-between gap-4"], {
              "text-blue-500":
                defaultPinned === "right" || column.getIsPinned() === "right",
            })}
          >
            Fixa Direita
            <PinIcon
              className={cn(["mr-2 h-3.5 w-3.5 text-muted-foreground"], {
                "fill-blue-500 text-blue-500":
                  defaultPinned === "right" || column.getIsPinned() === "right",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!!defaultPinned}
            onClick={() => column.pin("left")}
            className={cn(["text-foreground flex justify-between gap-4"], {
              "text-blue-500":
                defaultPinned === "left" || column.getIsPinned() === "left",
            })}
          >
            Fixa Esquerda
            <PinIcon
              className={cn(["mr-2 h-3.5 w-3.5 text-muted-foreground"], {
                "fill-blue-500 text-blue-500":
                  defaultPinned === "left" || column.getIsPinned() === "left",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!!defaultPinned || !column.getIsPinned()}
            onClick={() => column.pin(false)}
            className="flex justify-between gap-4"
          >
            Desafixar
            <PinOffIcon className={cn(["mr-2 h-3.5 w-3.5 "])} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
