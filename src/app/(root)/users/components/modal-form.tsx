"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { cn } from "@/lib/utils";

export const Modal = ({
  children,
  trigger,
  modalKey = "default-modal",
  className,
}: {
  children: React.ReactNode;
  trigger?: React.ReactNode | string;
  modalKey?: string;
  className?: string;
}) => {
  const { onClose, onOpen, open } = useModalInstance(modalKey);

  return (
    <Sheet
      open={open}
      onOpenChange={(open: boolean) => {
        if (open) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button className={cn("", className)}>{trigger}</Button>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        {children}
      </SheetContent>
    </Sheet>
  );
};
