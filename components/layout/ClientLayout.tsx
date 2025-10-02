"use client"

import { useState } from "react"
import Header from "./Header"
import Footer from "./Footer"
import CartSidebar from "../CartSidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  const handleCartClose = () => {
    setIsCartOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={handleCartClick} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  )
}
