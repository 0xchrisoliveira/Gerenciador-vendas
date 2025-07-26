"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, CreditCard } from "lucide-react"
import type { Produto, ItemComanda } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

export function VenderTab() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [comanda, setComanda] = useState<ItemComanda[]>([])
  const [formaPagamento, setFormaPagamento] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      const result = await fetch("/api/produtos")
      const data = await result.json()
      setProdutos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      })
    }
  }

  const adicionarProdutoComanda = (produto: Produto) => {
    setComanda((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      setComanda((prev) => prev.filter((item) => item.produto.id !== produtoId))
    } else {
      setComanda((prev) =>
        prev.map((item) => (item.produto.id === produtoId ? { ...item, quantidade: novaQuantidade } : item)),
      )
    }
  }

  const calcularTotal = () => {
    return comanda.reduce((total, item) => total + Number(item.produto.preco) * item.quantidade, 0)
  }

  const finalizarVenda = async () => {
    if (comanda.length === 0 || !formaPagamento) return

    try {
      const venda = {
        data_hora: Date.now(),
        valor_total: calcularTotal(),
        forma_pagamento: formaPagamento,
        itens_vendidos: JSON.stringify(
          comanda.map((item) => ({
            nome: item.produto.nome,
            preco: item.produto.preco,
            quantidade: item.quantidade,
          })),
        ),
      }

      const response = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      })

      if (response.ok) {
        setComanda([])
        setFormaPagamento("")
        setIsDialogOpen(false)
        toast({
          title: "Sucesso",
          description: "Venda finalizada com sucesso!",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar venda",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-full">
      {/* Lista de Produtos - 70% */}
      <div className="w-[70%] p-4 border-r">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Produtos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {produtos.map((produto) => (
            <Card
              key={produto.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => adicionarProdutoComanda(produto)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2 text-gray-900">{produto.nome}</h3>
                <p className="text-lg font-bold text-blue-600">R$ {Number(produto.preco).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comanda Atual - 30% */}
      <div className="w-[30%] p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Comanda Atual</h2>

        <div className="space-y-3 mb-6">
          {comanda.map((item) => (
            <Card key={item.produto.id}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{item.produto.nome}</h4>
                  <span className="text-sm font-bold text-gray-900">
                    R$ {(Number(item.produto.preco) * item.quantidade).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Badge variant="secondary">{item.quantidade}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-gray-600">R$ {Number(item.produto.preco).toFixed(2)} cada</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {comanda.length > 0 && (
          <>
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">R$ {calcularTotal().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Finalizar Venda
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Finalizar Venda</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Forma de Pagamento</label>
                    <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={finalizarVenda}
                    disabled={!formaPagamento}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Confirmar Venda
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
