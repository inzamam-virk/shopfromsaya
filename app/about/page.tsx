import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SAYA</h1>
        <p className="text-xl text-gray-600">Soft & Chic Fashion for the Modern Woman</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            SAYA was born from a simple belief: every woman deserves to feel confident, comfortable, and beautiful in
            what she wears. Founded with a passion for creating timeless pieces that blend elegance with comfort, we've
            made it our mission to provide high-quality fashion that fits seamlessly into your lifestyle.
          </p>
          <p className="text-gray-600 mb-4">
            Our name "SAYA" reflects our commitment to authenticity and personal expression. We believe that fashion
            should be an extension of who you are – soft yet strong, chic yet comfortable, timeless yet contemporary.
          </p>
          <p className="text-gray-600">
            Every piece in our collection is carefully curated and designed with the modern woman in mind, ensuring that
            you look and feel your best, whether you're at work, at home, or out with friends.
          </p>
        </div>
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=400" alt="SAYA Fashion" fill className="object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
            <p className="text-gray-600">
              We source only the finest materials and work with skilled artisans to ensure every piece meets our high
              standards of quality and craftsmanship.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Fashion</h3>
            <p className="text-gray-600">
              We're committed to sustainable practices, from ethical sourcing to eco-friendly packaging, because we
              believe fashion should be beautiful inside and out.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. We're here to help you find the perfect pieces and ensure your shopping
              experience is exceptional.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          Have questions or want to learn more about SAYA? We'd love to hear from you.
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
      </div>
    </div>
  )
}
