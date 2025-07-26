import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const vendas = await sql`SELECT * FROM vendas ORDER BY data_hora DESC`
    // Convert numeric fields to numbers
    const vendasFormatted = vendas.map((venda) => ({
      ...venda,
      data_hora: Number(venda.data_hora),
      valor_total: Number(venda.valor_total),
    }))
    return NextResponse.json(vendasFormatted)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { data_hora, valor_total, forma_pagamento, itens_vendidos } = await request.json()

    if (!data_hora || !valor_total || !forma_pagamento || !itens_vendidos) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const formasPagamento = ["PIX", "Débito", "Crédito", "Dinheiro"]
    if (!formasPagamento.includes(forma_pagamento)) {
      return NextResponse.json({ error: "Forma de pagamento inválida" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO vendas (data_hora, valor_total, forma_pagamento, itens_vendidos) 
      VALUES (${data_hora}, ${valor_total}, ${forma_pagamento}, ${itens_vendidos}) 
      RETURNING *
    `

    // Convert numeric fields to numbers
    const vendaFormatted = {
      ...result[0],
      data_hora: Number(result[0].data_hora),
      valor_total: Number(result[0].valor_total),
    }

    return NextResponse.json(vendaFormatted)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar venda" }, { status: 500 })
  }
}
