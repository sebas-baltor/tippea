import { AppSidebar } from "@/components/sidebar/sidebar";
import { SiteHeader } from "@/components/navbar/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { ThemeProvider } from "../theme/theme-provider";
import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";

export default function Layout() {
  return (
    // <ThemeProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col" defaultOpen={false}>
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className="p-4 overflow-y-auto max-h-[calc(100svh-var(--header-height)-1px)]!">
              <Outlet/>
            </SidebarInset>
          </div>
          <Toaster/>
        </SidebarProvider>
      </div>
    // </ThemeProvider>
  );
}
