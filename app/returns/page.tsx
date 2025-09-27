import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Returns & Exchanges</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We want you to be completely satisfied with your purchase. Our hassle-free return policy 
          makes it easy to return or exchange items that don't meet your expectations.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              30-Day Return Window
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You have 30 days from the delivery date to return unused items in original packaging.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Easy Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Contact our customer service team to initiate a return. We'll guide you through the process.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Quick Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Refunds are processed within 5-7 business days after we receive your returned items.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Return an Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600 text-sm">
              Reach out to our customer service team via email, phone, or contact form to initiate your return.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Authorization</h3>
            <p className="text-gray-600 text-sm">
              We'll provide you with a return authorization number and detailed instructions for your return.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Item</h3>
            <p className="text-gray-600 text-sm">
              Pack the item securely in its original packaging with all tags and accessories included.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Back</h3>
            <p className="text-gray-600 text-sm">
              Ship the item back to us using the provided return address and tracking information.
            </p>
          </div>
        </div>
      </div>

      {/* Return Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Items Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Unused items in original packaging
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Items with all original tags and accessories
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Items returned within 30 days of delivery
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Items that are defective or damaged upon arrival
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Items sent in error by us
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Items Not Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                Used or opened personal care items
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                Items without original packaging
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                Items returned after 30 days
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                Items damaged by misuse or normal wear
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                Custom or personalized items
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Exchanges</h2>
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need a Different Size or Color?</h3>
            <p className="text-gray-600 mb-6">
              We offer exchanges for items in different sizes or colors, subject to availability. 
              The exchange process follows the same steps as returns, but we'll send you the new item 
              as soon as we receive your return.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Exchange Process:</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Contact us to request an exchange</li>
                  <li>• Specify the desired size/color</li>
                  <li>• We'll check availability</li>
                  <li>• Return your original item</li>
                  <li>• Receive your new item</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Exchange Terms:</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Same 30-day window applies</li>
                  <li>• Original packaging required</li>
                  <li>• Subject to item availability</li>
                  <li>• Price differences may apply</li>
                  <li>• Free shipping on exchanges</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Information */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Refund Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Refund Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Return Received</p>
                  <p className="text-sm text-gray-600">We receive your returned item</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Quality Check</p>
                  <p className="text-sm text-gray-600">We inspect the returned item (1-2 days)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Refund Processed</p>
                  <p className="text-sm text-gray-600">Refund issued to original payment method (5-7 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Digital Payments</h4>
                <p className="text-gray-600 text-sm">
                  Refunds for EVC Plus, Zaad Service, and Sahal Service payments are processed 
                  back to the original payment method within 5-7 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cash on Delivery</h4>
                <p className="text-gray-600 text-sm">
                  For COD orders, refunds are processed via bank transfer or mobile money. 
                  You'll need to provide your preferred refund method details.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Store Credit</h4>
                <p className="text-gray-600 text-sm">
                  You can choose to receive store credit instead of a refund, which can be 
                  used for future purchases and never expires.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center bg-primary rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Need Help with Your Return?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Our customer service team is here to help you with any questions about returns or exchanges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
            <Link href="/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
