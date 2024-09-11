import React from "react";
import { Bot, LayoutDashboard, Settings2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },

  {
    label: "Models",
    href: "/models",
    icon: <Bot />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings2 />,
  },
];

function Sidebar() {
  return (
    <div className="flex w-20 flex-col items-center gap-2 border-r border-border p-4">
      <TooltipProvider>
        {sidebarItems.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                {item.icon}
                <span className="sr-only text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

export default Sidebar;
