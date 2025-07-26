"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, TrendingUp, CreditCard, ShoppingBag, MoreVertical, Trash2, Eye } from "lucide-react"
import type { Venda } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RelatoriosTab() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([])
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [formaPagamentoFiltro, setFormaPagamentoFiltro] = useState("all") // Updated default value
  const { toast } = useToast()

  useEffect(() => {
    carregarVendas()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [vendas, dataInicio, dataFim, formaPagamentoFiltro])

  const carregarVendas = async () => {
    try {
      const response = await fetch("/api/vendas")
      const data = await response.json()
      setVendas(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar vendas",
        variant: "destructive",
      })
    }
  }

  const aplicarFiltros = () => {
    let filtradas = [...vendas]

    if (dataInicio) {
      const inicioTimestamp = new Date(dataInicio).getTime()
      filtradas = filtradas.filter((venda) => venda.data_hora >= inicioTimestamp)
    }

    if (dataFim) {
      const fimTimestamp = new Date(dataFim + "T23:59:59").getTime()
      filtradas = filtradas.filter((venda) => venda.data_hora <= fimTimestamp)
    }

    if (formaPagamentoFiltro !== "all") {
      filtradas = filtradas.filter((venda) => venda.forma_pagamento === formaPagamentoFiltro)
    }

    setVendasFiltradas(filtradas)
  }

  const calcularResumo = () => {
    const valorTotal = vendasFiltradas.reduce((sum, venda) => sum + Number(venda.valor_total), 0)
    const ticketMedio = vendasFiltradas.length > 0 ? valorTotal / vendasFiltradas.length : 0
    return { valorTotal, ticketMedio, totalVendas: vendasFiltradas.length }
  }

  const exportarCSV = () => {
    const headers = ["ID_Venda", "Data_Hora", "Valor_Total", "Forma_Pagamento", "Itens_Vendidos"]
    const csvContent = [
      headers.join(","),
      ...vendasFiltradas.map((venda) =>
        [
          venda.id,
          new Date(venda.data_hora).toLocaleString("pt-BR"),
          venda.valor_total.toFixed(2),
          venda.forma_pagamento,
          `"${venda.itens_vendidos.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `vendas_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso!",
    })
  }

  const excluirVenda = async (id: number) => {
    try {
      const response = await fetch(`/api/vendas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        carregarVendas()
        toast({
          title: "Sucesso",
          description: "Venda excluída com sucesso!",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao excluir venda",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir venda",
        variant: "destructive",
      })
    }
  }

  const visualizarDetalhesVenda = (venda: Venda) => {
    try {
      const itens = JSON.parse(venda.itens_vendidos)
      const detalhes = itens
        .map((item: any) => `${item.quantidade}x ${item.nome} - R$ ${Number(item.preco).toFixed(2)}`)
        .join("\n")

      alert(
        `Detalhes da Venda #${venda.id}\n\nData: ${new Date(venda.data_hora).toLocaleString("pt-BR")}\nForma de Pagamento: ${venda.forma_pagamento}\nTotal: R$ ${Number(venda.valor_total).toFixed(2)}\n\nItens:\n${detalhes}`,
      )
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao visualizar detalhes da venda",
        variant: "destructive",
      })
    }
  }

  const resumo = calcularResumo()

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Relatórios</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Vendido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {resumo.valorTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ {resumo.ticketMedio.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{resumo.totalVendas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div>
              <Label>Forma de Pagamento</Label>
              <Select value={formaPagamentoFiltro} onValueChange={setFormaPagamentoFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem> {/* Updated value */}
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Débito">Débito</SelectItem>
                  <SelectItem value="Crédito">Crédito</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={exportarCSV} className="w-full bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vendasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma venda encontrada</p>
            ) : (
              vendasFiltradas
                .sort((a, b) => b.data_hora - a.data_hora)
                .map((venda) => (
                  <div key={venda.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{new Date(venda.data_hora).toLocaleString("pt-BR")}</p>
                      <p className="text-sm text-gray-600">{venda.forma_pagamento}</p>
                    </div>
                    <div className="text-right mr-3">
                      <p className="font-bold text-green-600">R$ {Number(venda.valor_total).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">ID: {venda.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => visualizarDetalhesVenda(venda)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir Venda
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                                <br />
                                <br />
                                <strong>Venda #{venda.id}</strong>
                                <br />
                                Data: {new Date(venda.data_hora).toLocaleString("pt-BR")}
                                <br />
                                Valor: R$ {Number(venda.valor_total).toFixed(2)}
                                <br />
                                Pagamento: {venda.forma_pagamento}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => excluirVenda(venda.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir Venda
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
