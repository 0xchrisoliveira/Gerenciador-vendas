import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Verificar se a venda existe
    const vendaExistente = await sql`SELECT id FROM vendas WHERE id = ${id}`

    if (vendaExistente.length === 0) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    // Excluir a venda
    await sql`DELETE FROM vendas WHERE id = ${id}`

    return NextResponse.json({ success: true, message: "Venda excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir venda:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const venda = await sql`SELECT * FROM vendas WHERE id = ${id}`

    if (venda.length === 0) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    // Convert numeric fields to numbers
    const vendaFormatted = {
      ...venda[0],
      data_hora: Number(venda[0].data_hora),
      valor_total: Number(venda[0].valor_total),
    }

    return NextResponse.json(vendaFormatted)
  } catch (error) {
    console.error("Erro ao buscar venda:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
