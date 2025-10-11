"use client"

import { ShoppingCart, Menu, Search, Heart, User, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/lib/stores/cart-store"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { getTotalItems } = useCartStore()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const totalItems = getTotalItems()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authApi.me()
      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      // User not authenticated
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear any stored auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
      setUser(null)
      toast.success("Logged out successfully")
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Error logging out")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-8">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/">
            <Image src="/Logo.svg" alt="Bulaale Baby Care" width={100} height={100} />
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/products" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              All Products
            </a>
            <a href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </a>
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-4 py-2 w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
          <button className="hidden md:block">
            <Heart className="h-5 w-5 text-foreground hover:text-accent transition-colors" />
          </button>
          
          {/* User Authentication Section */}
          {isLoading ? (
            <div className="hidden md:block w-8 h-8 bg-muted animate-pulse rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <button 
            className="relative hover:bg-accent/10 p-2 rounded-lg transition-colors"
            onClick={onCartClick}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-[11px] font-semibold text-white flex items-center justify-center animate-pulse">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          
          {/* Mobile Authentication */}
          <div className="md:hidden flex items-center gap-2">
            {isLoading ? (
              <div className="w-6 h-6 bg-muted animate-pulse rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
