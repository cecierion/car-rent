"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Car, BarChartIcon as ChartBarIcon, LogOut, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationDropdown } from "@/components/notification/notification-dropdown"
import { logoutAdmin } from "@/lib/auth"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>Admin Dashboard</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/customers">
                <Users className="h-4 w-4 mr-2" />
                Customers
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </nav>
          <NotificationDropdown />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
