import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../../constants/modal-keys";
import { useDelete } from "@/hooks/use-crud";

export const ModulesConfirmDelete = () => {
  const {
    open,
    data: row,
    onOpen: onConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useModalInstance(MODAL_KEYS.DELETE_MODULE);

  const { mutate: deleteModule } = useDelete({
    route: "/permissao-grupos",
    mutationKey: ["delete-module"],
    queryInvalidationKeys: ["modules"],
  });
  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        if (open) {
          onCloseConfirmDelete();
        } else {
          onConfirmDelete(row);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            registro e removerá seus dados de nossos servidores.
            <span>
              Você está prestes a excluir{" "}
              <strong className="bg-red-500/10 text-red-500 italic">
                &quot;{row?.name}&quot;
              </strong>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="w-full"
            onClick={() => deleteModule({ id: row._id })}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
