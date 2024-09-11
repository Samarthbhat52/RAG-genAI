import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, LayoutDashboard, Settings2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={15} />,
  },

  {
    label: "Models",
    href: "/models",
    icon: <Bot size={15} />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings2 size={15} />,
  },
];

function NavLinks() {
  return (
    <>
      {sidebarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "flex gap-1",
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default NavLinks;
