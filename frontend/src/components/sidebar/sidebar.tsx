import * as React from "react";
import {
  Command,
  WalletMinimal,
} from "lucide-react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavUser } from "@/components/navbar/nav-user";
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

const data = {
  user: {
    name: "Sebastian",
    email: "sebastian@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Wallet",
      url: "/wallet",
      icon: WalletMinimal,
    }
    // {
    //   title: "Campañas",
    //   icon: PhoneForwarded,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Lista de Campañas",
    //       url: "/campaigns/list",
    //     },
    //     {
    //       title: "Configuraciones",
    //       url: "/campaigns/configurations",
    //     },
    //   ],
    // },
    // {
    //   title: "Chat",
    //   url: "/chat",
    //   icon: MessageCircleMore,
    // },
    // {
    //   title: "Contactos",
    //   icon: BookOpen,
    //   url: "/contacts",
    // },
    //  {
    //   title: "Mensajes",
    //   url: "/messages",
    //   icon: MessageSquareText,
    // },
    // {
    //   title: "Conexiones",
    //   url: "/connections",
    //   icon: QrCode,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {import.meta.env.VITE_APP_NAME}
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
