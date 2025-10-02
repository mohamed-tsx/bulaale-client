import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Mother of Two",
    content:
      "The quality is outstanding! My babies are so comfortable in their clothes, and I love that everything is organic and safe.",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "First-Time Mom",
    content:
      "Shopping here made preparing for my baby so easy. The care products are gentle and effective, exactly what I was looking for.",
    rating: 5,
  },
  {
    name: "Jessica L.",
    role: "Parent",
    content:
      "Beautiful designs and exceptional quality. The shoes are perfect for my little one learning to walk. Highly recommend!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <h3 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-foreground">
            Loved by Parents
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See what families are saying about us</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6 space-y-4 border-border/50 shadow-sm">
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
              <div>
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
