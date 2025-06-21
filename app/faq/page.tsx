"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "Orders & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) and bank transfers. For COD, you pay when you receive your order. For bank transfers, payment is required before shipping.",
  },
  {
    category: "Orders & Payment",
    question: "How do I place an order?",
    answer:
      "Simply browse our products, add items to your cart, and proceed to checkout. Fill in your details and choose your preferred payment method. You'll receive a confirmation via WhatsApp.",
  },
  {
    category: "Orders & Payment",
    question: "Can I modify or cancel my order?",
    answer:
      "You can modify or cancel your order within 2 hours of placing it by contacting us on WhatsApp. After this time, we may have already started processing your order.",
  },
  {
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location: Karachi (1-2 days), major cities (2-3 days), and other areas (3-5 days). Express delivery is available for faster shipping.",
  },
  {
    category: "Shipping & Delivery",
    question: "Do you offer free shipping?",
    answer:
      "Yes! We offer free shipping on orders over Rs. 5,000 within major cities. For smaller orders, standard shipping rates apply.",
  },
  {
    category: "Shipping & Delivery",
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, we'll send you tracking information via WhatsApp. You can use this to monitor your delivery status.",
  },
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy from the delivery date. Items must be in original condition with tags attached. Contact us via WhatsApp to initiate a return.",
  },
  {
    category: "Returns & Exchanges",
    question: "How do I exchange an item for a different size?",
    answer:
      "Contact us on WhatsApp within 7 days of delivery. We offer free size exchanges subject to availability. We'll guide you through the exchange process.",
  },
  {
    category: "Returns & Exchanges",
    question: "Who pays for return shipping?",
    answer:
      "For defective items or our errors, we cover return shipping. For other returns (wrong size, change of mind), return shipping costs are borne by the customer.",
  },
  {
    category: "Products & Sizing",
    question: "How do I find my correct size?",
    answer:
      "Check our detailed size guide with measurements for each category. When between sizes, we recommend sizing up. Contact us for personalized sizing advice.",
  },
  {
    category: "Products & Sizing",
    question: "Are the colors accurate in photos?",
    answer:
      "We strive for color accuracy, but slight variations may occur due to screen settings and lighting. If you're unsure about a color, contact us for more details.",
  },
  {
    category: "Products & Sizing",
    question: "Do you restock sold-out items?",
    answer:
      "We regularly restock popular items, but availability varies. Follow us on social media or contact us to be notified when specific items are back in stock.",
  },
  {
    category: "Account & Support",
    question: "Do I need an account to shop?",
    answer:
      "No, you can shop as a guest. However, creating an account allows you to track orders, save addresses, and view your order history for a better experience.",
  },
  {
    category: "Account & Support",
    question: "How can I contact customer support?",
    answer:
      "The fastest way to reach us is via WhatsApp at +92 314 936 3244. You can also use our contact form on the website. We're available Monday-Saturday, 9 AM-8 PM.",
  },
  {
    category: "Account & Support",
    question: "Is my personal information secure?",
    answer:
      "Yes, we take data security seriously. Your personal information is encrypted and stored securely. We never share your details with third parties without consent.",
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(faqData.map((item) => item.category)))]

  const filteredFAQs =
    selectedCategory === "All" ? faqData : faqData.filter((item) => item.category === selectedCategory)

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">Find answers to common questions about shopping with SAYA</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923149363244"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              WhatsApp: +92 314 936 3244
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
