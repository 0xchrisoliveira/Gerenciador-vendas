"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { BottomNavigation } from "@/components/bottom-navigation"
import { VenderTab } from "@/components/vender-tab"
import { ProdutosTab } from "@/components/produtos-tab"
import { RelatoriosTab } from "@/components/relatorios-tab"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { isAuthenticated, logout } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("vender")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "vender":
        return <VenderTab />
      case "produtos":
        return <ProdutosTab />
      case "relatorios":
        return <RelatoriosTab />
      default:
        return <VenderTab />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Gestor de Vendas</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">{renderActiveTab()}</main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <Toaster />
    </div>
  )
}
