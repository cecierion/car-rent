"use client"

export function loginAdmin(email: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "erionceci@hormail.com" && password === "YES2025") {
        localStorage.setItem("car_rental_admin_auth", "authenticated")
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("car_rental_admin_auth")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("car_rental_admin_auth") === "authenticated"
}
