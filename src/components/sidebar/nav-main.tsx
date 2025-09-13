"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEY_NEW_RESERVATION } from "../new-reserve-modal";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    disabled?: boolean;
    icon?: Icon;
  }[];
}) {
  const { onOpen } = useModalInstance(MODAL_KEY_NEW_RESERVATION);
  const pathname = usePathname();
  function isActive(item: { url: string }) {
    return item.url === pathname;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-zinc-200 hover:bg-primary/90 hover:text-zinc-50 active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => onOpen()}
            >
              <IconCirclePlusFilled />
              <span>Nova Reserva Rápida</span>
            </SidebarMenuButton>
            {/* <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.url}
                className="w-full h-full "
              >
                <SidebarMenuButton
                  isActive={isActive(item)}
                  disabled={item.disabled}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
