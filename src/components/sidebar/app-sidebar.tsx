"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VenusAndMarsIcon } from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { SIDEBAR_PAGES, siteConfig } from "@/config/site-config";
import { IconReceiptDollar } from "@tabler/icons-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconReceiptDollar className="!size-5" />
                <span className="text-base font-semibold">
                  {siteConfig.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense>
          <NavMain items={SIDEBAR_PAGES.navMain} />
          <NavDocuments items={SIDEBAR_PAGES.documents} />
          <NavSecondary
            items={SIDEBAR_PAGES.navSecondary}
            className="mt-auto"
          />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR_PAGES.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
