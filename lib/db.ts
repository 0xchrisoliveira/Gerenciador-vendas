import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface Produto {
  id: number
  nome: string
  preco: number
}

export interface Venda {
  id: number
  data_hora: number
  valor_total: number
  forma_pagamento: string
  itens_vendidos: string
}

export interface ItemComanda {
  produto: Produto
  quantidade: number
}
