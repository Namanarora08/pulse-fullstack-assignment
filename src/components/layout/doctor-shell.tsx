import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Sidebar } from "@/components/layout/sidebar";

type DoctorShellProps = {
  children: React.ReactNode;
};

export function DoctorShell({ children }: DoctorShellProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-0 lg:pl-72">
      <Sidebar />
      {children}
      <MobileNavigation />
    </div>
  );
}
