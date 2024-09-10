import React from "react";
import { Icon, icons } from "lucide-react";

interface DynamicIconsProps {
  name: string;
  color?: string;
  size?: number;
}

function DynamicIcons({ name, color, size }: DynamicIconsProps) {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} />;
}

export default DynamicIcons;
