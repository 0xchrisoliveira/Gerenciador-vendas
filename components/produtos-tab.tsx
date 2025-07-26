"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import type { Produto } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

export function ProdutosTab() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null)
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      const response = await fetch("/api/produtos")
      const data = await response.json()
      setProdutos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      })
    }
  }

  const salvarProduto = async () => {
    if (!nome || !preco || Number.parseFloat(preco) <= 0) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios. Preço deve ser maior que zero.",
        variant: "destructive",
      })
      return
    }

    try {
      const produto = { nome, preco: Number.parseFloat(preco) }
      const url = editingProduct ? `/api/produtos/${editingProduct.id}` : "/api/produtos"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      })

      if (response.ok) {
        carregarProdutos()
        setIsDialogOpen(false)
        setEditingProduct(null)
        setNome("")
        setPreco("")
        toast({
          title: "Sucesso",
          description: editingProduct ? "Produto atualizado!" : "Produto criado!",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive",
      })
    }
  }

  const excluirProduto = async (id: number) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        carregarProdutos()
        toast({
          title: "Sucesso",
          description: "Produto excluído!",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      })
    }
  }

  const abrirEdicao = (produto: Produto) => {
    setEditingProduct(produto)
    setNome(produto.nome)
    setPreco(produto.preco.toString())
    setIsDialogOpen(true)
  }

  const abrirCriacao = () => {
    setEditingProduct(null)
    setNome("")
    setPreco("")
    setIsDialogOpen(true)
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
      </div>

      <div className="grid gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{produto.nome}</h3>
                  <p className="text-lg font-bold text-blue-600">R$ {Number(produto.preco).toFixed(2)}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => abrirEdicao(produto)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => excluirProduto(produto.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão Flutuante */}
      <Button
        onClick={abrirCriacao}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Dialog para Criar/Editar Produto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do produto"
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <Button onClick={salvarProduto} className="w-full bg-blue-600 hover:bg-blue-700">
              {editingProduct ? "Atualizar" : "Criar"} Produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
