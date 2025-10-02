"use client"

import { ShoppingCart, Menu, Search, Heart, User } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/lib/stores/cart-store"

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-8">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <Image src="/Logo.svg" alt="Bulaale Baby Care" width={100} height={100} />
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
          <button className="hidden md:block">
            <User className="h-5 w-5 text-foreground hover:text-accent transition-colors" />
          </button>
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
        </div>
      </div>
    </header>
  )
}
