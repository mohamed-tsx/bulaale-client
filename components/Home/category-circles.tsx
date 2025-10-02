import { Shirt, Baby, Heart, Sparkles } from "lucide-react"

const categories = [
  {
    name: "Clothing",
    icon: Shirt,
    count: "2,847 items",
  },
  {
    name: "Baby Care",
    icon: Baby,
    count: "1,523 items",
  },
  {
    name: "Favorites",
    icon: Heart,
    count: "Save 20%",
  },
  {
    name: "New Arrivals",
    icon: Sparkles,
    count: "Just added",
  },
]

export function CategoryCircles() {
  return (
    <section className="py-8 border-b bg-background max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button key={category.name} className="flex flex-col items-center gap-2 min-w-[100px] group">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <category.icon className="h-7 w-7 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
