import { Moon, Sun } from "lucide-react";
import {Switch } from "@/components/ui/switch";

import { useTheme } from "@/providers/ThemeProvider"

export function ThemeToggle(){
  const { theme, setThemePreference } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun
        className="h-[1.2rem] w-[1.2rem]"
        aria-hidden="true"
      />

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setThemePreference(checked ? "dark" : "light")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />

      <Moon
        className="h-[1.2rem] w-[1.2rem]"
        aria-hidden="true"
      />
    </div>   
  )
}
