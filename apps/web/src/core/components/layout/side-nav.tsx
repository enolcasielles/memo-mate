"use client";

import { cn } from "@/core/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/core/components/base/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/core/components/base/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "HomeIcon",
  },
  {
    title: "Suscripción",
    href: "/dashboard/subscription",
    icon: "CreditCardIcon",
  },
  {
    title: "Contactos",
    href: "/dashboard/contacts",
    icon: "UsersIcon",
  },
];

function NavContent() {
  const pathname = usePathname();

  return (
    <div className="flex-1 px-4 space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === item.href ? "bg-primary text-white" : "hover:bg-muted",
          )}
        >
          {/* Aquí irían los iconos */}
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}

export function NavMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetClose asChild>
            <div></div>
          </SheetClose>
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function NavDesktop() {
  return (
    <nav className="hidden lg:flex lg:flex-col w-64 border-r bg-muted/50">
      {/* Logo solo visible en desktop */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">MemoMate</h1>
      </div>
      <NavContent />
    </nav>
  );
}
