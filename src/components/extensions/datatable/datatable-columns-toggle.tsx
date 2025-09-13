import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Settings2Icon } from "lucide-react";

export const DataTableColumnsToggle = ({
  table,
  columnTitles,
  className = "",
}: {
  table: any;
  columnTitles?: Record<string, string>;
  className?: string;
}) => {
  function formatColumnId(value: string): string {
    return value.replace(/_/g, " ");
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn("", className)}
          >
            Colunas
            <Settings2Icon className="ml-2 w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column: any) => column.getCanHide())
            .map((column: any, index: number) => {
              const columnTitleAux = columnTitles
                ? columnTitles[formatColumnId(column.id).replace(/\s+/g, "_")]
                : formatColumnId(column.id);
              return (
                <DropdownMenuCheckboxItem
                  key={index}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnTitleAux}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
