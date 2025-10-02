import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-background border-b max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-muted/30 rounded-2xl p-8 md:p-12 lg:p-16">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground leading-tight">
                SHOP BABY ESSENTIALS & CARE
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium quality products for your little ones. Soft, safe, and designed with love.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base font-medium px-8">
                Shop now
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <img
                src="/Somali-Kid.jpg"
                alt="Baby products"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-full px-4 py-2 font-semibold text-sm shadow-lg">
                $29.99
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
          </div>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
