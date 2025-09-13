"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalInstance } from "@/hooks/use-modal-instance";
export const MODAL_KEY_NEW_RESERVATION = "new-reservation";
export const NewReservationDialog = () => {
  const { open, onOpenChange } = useModalInstance(MODAL_KEY_NEW_RESERVATION);
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Reservation</DialogTitle>
          <DialogDescription>
            Create a new reservation for your room.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md  min-h-44 bg-muted/50 p-4"></div>
        <div className="rounded-md  min-h-12 bg-muted/50 p-4"></div>
      </DialogContent>
    </Dialog>
  );
};
