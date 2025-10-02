import { ShoppingCart, Menu, Search, Heart, User } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-8">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">BabyNest</h1>
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              All Products
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Clothing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Shoes
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Baby Care
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sale
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
          <button className="relative">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-[11px] font-semibold text-accent-foreground flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
