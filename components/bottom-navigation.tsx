"use client"

import { ShoppingCart, Package, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "vender", label: "Vender", icon: ShoppingCart },
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                activeTab === tab.id ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
