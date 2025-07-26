import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const validUsername = process.env.AUTH_USERNAME || "admin"
    const validPassword = process.env.AUTH_PASSWORD || "admin123"

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
