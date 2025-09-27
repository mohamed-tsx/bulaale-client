import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        question: 'What is Bulaale Baby Care?',
        answer: 'Bulaale Baby Care is an online store specializing in premium baby care products. We curate high-quality, safe products from trusted brands to help parents provide the best care for their little ones.'
      },
      {
        question: 'Where do you ship?',
        answer: 'We currently ship across Somalia with free delivery to major cities. We\'re working on expanding our shipping coverage to other East African countries.'
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can also track your order status in your account dashboard.'
      }
    ]
  },
  {
    category: 'Products',
    questions: [
      {
        question: 'Are your products safe for babies?',
        answer: 'Yes, absolutely. All our products are carefully selected for safety and quality. We only work with reputable brands that meet international safety standards and certifications.'
      },
      {
        question: 'Do you have age recommendations for products?',
        answer: 'Yes, most products include age recommendations. You can find this information in the product description and specifications. When in doubt, consult with your pediatrician.'
      },
      {
        question: 'Can I see product ingredients?',
        answer: 'Yes, detailed ingredient lists are available for all products. You can find this information in the product details section on each product page.'
      },
      {
        question: 'Do you offer organic products?',
        answer: 'Yes, we have a selection of organic and natural baby care products. Look for the organic badge on product pages or use our filters to browse organic products.'
      }
    ]
  },
  {
    category: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 2-5 business days for most areas in Somalia. Express shipping options are available for urgent orders with 1-2 day delivery.'
      },
      {
        question: 'What are your shipping costs?',
        answer: 'We offer free shipping on orders over $50. For smaller orders, shipping costs vary by location and are calculated at checkout.'
      },
      {
        question: 'Can I change or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it. After that, orders are processed and cannot be changed. Contact us immediately if you need to make changes.'
      },
      {
        question: 'What if my order is damaged during shipping?',
        answer: 'If your order arrives damaged, please contact us immediately with photos. We\'ll arrange for a replacement or full refund at no cost to you.'
      }
    ]
  },
  {
    category: 'Payment',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept EVC Plus, Zaad Service, Sahal Service, and Cash on Delivery. All digital payments are processed securely through our payment partners.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your full payment details on our servers.'
      },
      {
        question: 'When will I be charged?',
        answer: 'For digital payments, you\'re charged immediately when you place your order. For Cash on Delivery, you pay when the package is delivered.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Yes, we offer refunds for unused products returned within 30 days in original packaging. Refunds are processed within 5-7 business days.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unused products in original packaging. Items must be in resellable condition. Some items like personal care products may have different return policies.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Contact our customer service team to initiate a return. We\'ll provide you with a return authorization number and instructions for returning the item.'
      },
      {
        question: 'Who pays for return shipping?',
        answer: 'If the return is due to our error or a defective product, we cover the return shipping costs. For other returns, the customer is responsible for return shipping.'
      },
      {
        question: 'How long do refunds take?',
        answer: 'Once we receive your returned item, refunds are processed within 5-7 business days. The time for the refund to appear in your account depends on your payment method.'
      }
    ]
  },
  {
    category: 'Account & Support',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top right corner and fill out the registration form. You\'ll need to provide your name, email, and create a password.'
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a link to reset your password.'
      },
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at info@bulaale.com, phone at +252 61 123 4567, or through our contact form. We typically respond within 24 hours.'
      },
      {
        question: 'Do you have a mobile app?',
        answer: 'Currently, we don\'t have a mobile app, but our website is fully optimized for mobile devices. We\'re working on developing a mobile app for the future.'
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our products, shipping, payments, and more. 
          Can't find what you're looking for? Contact us directly.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, faqIndex) => (
                <Collapsible key={faqIndex}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Can't find the answer you're looking for? Our customer support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/contact">Contact Support</a>
          </Button>
          <Button asChild variant="outline">
            <a href="mailto:info@bulaale.com">Email Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
