"use client"
import { Check, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLocaleStore, type LocaleKey } from "@/lib/date-fns"

const localeNames: Record<LocaleKey, string> = {
  enUS: "English (US)",
  id: "Bahasa Indonesia",
}

export function LocaleSelector() {
  const { currentLocale, setLocale } = useLocaleStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="hover:scale-110 transition-transform duration-200">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(localeNames).map(([key, name]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setLocale(key as LocaleKey)}
            className="flex items-center justify-between hover:bg-accent/80 transition-colors duration-200"
          >
            {name}
            {currentLocale === key && <Check className="h-4 w-4 ml-2 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
