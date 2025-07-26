export const AUTH_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_AUTH_USERNAME || "admin",
  password: process.env.NEXT_PUBLIC_AUTH_PASSWORD || "admin123",
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("authenticated") === "true"
}

export function login(username: string, password: string): boolean {
  if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
    localStorage.setItem("authenticated", "true")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("authenticated")
}
