"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const heroSlides = [
  {
    id: 1,
    title: "SHOP BABY ESSENTIALS & CARE",
    subtitle: "Premium quality products for your little ones. Soft, safe, and designed with love.",
    image: "/Somali-Kid.jpg",
    price: "$29.99",
    buttonText: "Shop now",
    bgGradient: "from-blue-50 to-indigo-100"
  },
  {
    id: 2,
    title: "ORGANIC BABY CLOTHES",
    subtitle: "Gentle on delicate skin. Made from 100% organic cotton for ultimate comfort.",
    image: "/Somali-Kid.jpg",
    price: "$24.99",
    buttonText: "Explore Collection",
    bgGradient: "from-green-50 to-emerald-100"
  },
  {
    id: 3,
    title: "SAFE BABY TOYS",
    subtitle: "Educational and safe toys that stimulate your baby's development and creativity.",
    image: "/Somali-Kid.jpg",
    price: "$19.99",
    buttonText: "Discover Toys",
    bgGradient: "from-pink-50 to-rose-100"
  }
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative bg-background border-b max-w-7xl mx-auto overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className={`grid lg:grid-cols-2 gap-8 items-center bg-gradient-to-br ${currentSlideData.bgGradient} rounded-2xl p-8 md:p-12 lg:p-16 transition-all duration-1000 ease-in-out`}>
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground leading-tight animate-in slide-in-from-left duration-700">
                {currentSlideData.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-left duration-700 delay-200">
                {currentSlideData.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-in slide-in-from-left duration-700 delay-300">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {currentSlideData.buttonText}
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center animate-in slide-in-from-right duration-700 delay-200">
            <div className="relative w-full max-w-md aspect-square">
              <img
                src={currentSlideData.image}
                alt="Baby products"
                className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-full px-4 py-2 font-semibold text-sm shadow-lg animate-bounce">
                {currentSlideData.price}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button 
            onClick={goToPrevious}
            className="p-3 rounded-full hover:bg-muted transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-foreground scale-125' 
                    : 'bg-muted hover:bg-foreground/70'
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNext}
            className="p-3 rounded-full hover:bg-muted transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
