import { Card } from "@/components/ui/card"
import { Heart, Shield, Truck, Star } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every product is carefully selected with your baby's comfort and safety in mind."
  },
  {
    icon: Shield,
    title: "Safe & Certified",
    description: "All products meet the highest safety standards and are certified for baby use."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your baby essentials when you need them most."
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Only the finest materials and craftsmanship for your little one's delicate needs."
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <h3 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-foreground">
            Why Parents Trust Us
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We understand that your baby deserves only the best. Here's what makes us different.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 text-center space-y-4 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-foreground">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
