import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TeacherSidebar from "@/components/TeacherSidebar";
import CollegeBranding from "@/components/CollegeBranding";

const TeacherLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground hidden sm:inline">Smart Attendance</span>
            </div>
            <CollegeBranding size="sm" />
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeacherLayout;
