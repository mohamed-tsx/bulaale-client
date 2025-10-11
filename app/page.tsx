import { Header } from "@/components/Home/header"
import { Hero } from "@/components/Home/hero"
import { CategoryCircles } from "@/components/Home/category-circles"
import { CategoryGrid } from "@/components/Home/category-grid"
import { FeaturedProducts } from "@/components/Home/featured-products"
import { Testimonials } from "@/components/Home/testimonials"
import { Newsletter } from "@/components/Home/newsletter"
import { DiscountBanner } from "@/components/DiscountBanner"
import { DiscountDebugger } from "@/components/DiscountDebugger"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <DiscountBanner />
      <DiscountDebugger />
      <CategoryCircles />
      <CategoryGrid />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
