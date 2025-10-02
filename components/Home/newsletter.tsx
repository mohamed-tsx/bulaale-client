import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-balance">
            Join Our Little Nest Family
          </h3>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Get exclusive offers, parenting tips, and be the first to know about new arrivals
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground text-foreground border-0 flex-1"
            />
            <Button type="submit" variant="secondary" size="lg" className="sm:w-auto">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-primary-foreground/70">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
