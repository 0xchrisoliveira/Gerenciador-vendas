import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nome, preco } = await request.json()
    const id = Number.parseInt(params.id)

    if (!nome || preco <= 0) {
      return NextResponse.json({ error: "Nome e preço válido são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      UPDATE produtos 
      SET nome = ${nome}, preco = ${preco}
      WHERE id = ${id}
      RETURNING *
    `

    // Convert price to number
    const produtoFormatted = {
      ...result[0],
      preco: Number(result[0].preco),
    }

    return NextResponse.json(produtoFormatted)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await sql`DELETE FROM produtos WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 })
  }
}
