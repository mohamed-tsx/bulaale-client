import { Heart, Shield, Users, Award, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Bulaale Baby Care</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are dedicated to providing premium baby care products that prioritize safety, 
          quality, and comfort for your little ones. Our mission is to support parents 
          in giving their babies the best start in life.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To provide parents with access to the highest quality baby care products, 
            sourced from trusted brands and designed to support healthy development 
            and well-being.
          </p>
          <p className="text-gray-600">
            We believe every baby deserves the best care, and every parent deserves 
            peace of mind knowing they're making the right choices for their child.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-4">
            To become the leading provider of baby care products in Somalia, 
            known for our commitment to quality, safety, and exceptional customer service.
          </p>
          <p className="text-gray-600">
            We envision a future where every family has easy access to premium 
            baby care products that help their children thrive.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Care & Compassion</h3>
            <p className="text-gray-600">
              We approach everything we do with love and care, understanding that 
              your baby's well-being is our top priority.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
            <p className="text-gray-600">
              Every product we offer meets the highest safety standards. We never 
              compromise on the safety of your little ones.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Excellence</h3>
            <p className="text-gray-600">
              We carefully curate our product selection to ensure only the best 
              quality items make it to your family.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Focus</h3>
            <p className="text-gray-600">
              We're proud to serve families across Somalia, building a community 
              of parents who trust us with their baby's care.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Service</h3>
            <p className="text-gray-600">
              From fast delivery to responsive customer support, we're committed 
              to providing reliable service you can count on.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously seek out the latest and best baby care innovations 
              to bring you cutting-edge products.
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">
            Bulaale Baby Care was founded with a simple yet powerful vision: to make 
            premium baby care products accessible to families across Somalia. 
            As parents ourselves, we understand the challenges of finding safe, 
            high-quality products for our little ones.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our journey began when we realized that many parents were struggling 
            to find reliable sources for baby care products. We saw an opportunity 
            to bridge this gap by creating a trusted platform that curates only 
            the best products from reputable brands.
          </p>
          <p className="text-lg text-gray-600">
            Today, we're proud to serve thousands of families across Somalia, 
            helping them provide the best care for their babies. Every product 
            we offer has been carefully selected for its quality, safety, and 
            effectiveness, giving parents the confidence they need to make the 
            right choices for their children.
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Amina Hassan</h3>
            <p className="text-primary font-medium mb-2">Founder & CEO</p>
            <p className="text-gray-600 text-sm">
              Mother of two with 10+ years in healthcare. Passionate about 
              ensuring every baby gets the best start in life.
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mohamed Ali</h3>
            <p className="text-primary font-medium mb-2">Operations Director</p>
            <p className="text-gray-600 text-sm">
              Logistics expert ensuring our products reach families quickly 
              and safely across Somalia.
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fatima Ahmed</h3>
            <p className="text-primary font-medium mb-2">Quality Assurance</p>
            <p className="text-gray-600 text-sm">
              Pediatric nurse who reviews every product to ensure it meets 
              our strict safety and quality standards.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-primary rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl mb-8 text-blue-100">
          Become part of our growing community of parents who trust us with their baby's care
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/products">Start Shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
