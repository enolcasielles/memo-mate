"use client";

import { cn } from "@/core/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/core/components/base/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/core/components/base/button";
import { HomeIcon, CreditCardIcon, UsersIcon } from "lucide-react";

const menuItems = [
  {
    title: "Panel de control",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Suscripción",
    href: "/dashboard/subscription",
    icon: CreditCardIcon,
  },
  {
    title: "Contactos",
    href: "/dashboard/contacts",
    icon: UsersIcon,
  },
];

function NavContent() {
  const pathname = usePathname();

  return (
    <div className="flex-1 px-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              "hover:bg-blue-50 hover:scale-105",
              isActive 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "text-gray-600 hover:text-blue-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isActive 
                ? "bg-white/20" 
                : "bg-blue-50 text-blue-500"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function NavDesktop() {
  return (
    <nav className="hidden lg:flex lg:flex-col w-64 border-r bg-white">
      {/* Logo y título */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          MemoMate
        </h1>
      </div>
      <div className="flex flex-col flex-1 py-6">
        <NavContent />
      </div>
    </nav>
  );
}

export function NavMobile() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {/* Logo y título */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            MemoMate
          </h1>
        </div>
        <div className="flex flex-col flex-1 py-6">
          <NavContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
