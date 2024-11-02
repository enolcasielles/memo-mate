import { NavMobile, NavDesktop } from "@/core/components/layout/side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar para desktop */}
      <NavDesktop />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center justify-between border-b p-4">
          <NavMobile />
        </header>

        {/* Contenido principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
