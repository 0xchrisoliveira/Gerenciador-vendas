import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const produtos = await sql`SELECT * FROM produtos ORDER BY nome`
    // Convert price strings to numbers
    const produtosFormatted = produtos.map((produto) => ({
      ...produto,
      preco: Number(produto.preco),
    }))
    return NextResponse.json(produtosFormatted)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, preco } = await request.json()

    if (!nome || preco <= 0) {
      return NextResponse.json({ error: "Nome e preço válido são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO produtos (nome, preco) 
      VALUES (${nome}, ${preco}) 
      RETURNING *
    `

    // Convert price to number
    const produtoFormatted = {
      ...result[0],
      preco: Number(result[0].preco),
    }

    return NextResponse.json(produtoFormatted)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
