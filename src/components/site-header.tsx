"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { ToggleTheme } from "./toggle-theme";
import { useHeader } from "@/contexts/header-context";
import { useAuth } from "@/contexts/auth-context";

export function SiteHeader() {
  const { title } = useHeader();
  const { signOut } = useAuth();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <ToggleTheme />
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="hidden sm:flex"
            onClick={() => signOut()}
          >
            <div>
              Sair
              <LogOutIcon className="size-4" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
