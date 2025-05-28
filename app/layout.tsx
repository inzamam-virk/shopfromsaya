import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/cart/CartDrawer"
import WhatsAppChat from "@/components/WhatsAppChat"
import { CartProvider } from "@/contexts/CartContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAYA - Soft & Chic Fashion for Women",
  description:
    "Discover elegant and comfortable fashion for the modern woman. Shop dresses, tops, bottoms, and accessories at SAYA.",
  keywords: "women fashion, dresses, tops, bottoms, accessories, elegant, comfortable, SAYA",
  openGraph: {
    title: "SAYA - Soft & Chic Fashion for Women",
    description: "Discover elegant and comfortable fashion for the modern woman.",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <WhatsAppChat />
        </CartProvider>
      </body>
    </html>
  )
}
