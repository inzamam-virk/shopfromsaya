"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/CartContext"
import { supabase } from "@/lib/supabase"
import type { User as UserType } from "@/lib/types"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { getTotalItems, openCart } = useCart()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
        setUser(userData)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/svgviewer-png-output-8xW69cUnLpFeHkYFoKk5lTanpNJnrL.png"
              alt="SAYA"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-900 hover:text-gray-600 transition-colors">
              All Products
            </Link>
            <Link href="/products?category=dresses" className="text-gray-900 hover:text-gray-600 transition-colors">
              Dresses
            </Link>
            <Link href="/products?category=tops" className="text-gray-900 hover:text-gray-600 transition-colors">
              Tops
            </Link>
            <Link href="/products?category=bottoms" className="text-gray-900 hover:text-gray-600 transition-colors">
              Bottoms
            </Link>
            <Link href="/products?category=accessories" className="text-gray-900 hover:text-gray-600 transition-colors">
              Accessories
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.full_name}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Order History
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                      <Link href="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Products
                      </Link>
                      <Link href="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button variant="ghost" size="sm" onClick={openCart} className="relative flex items-center space-x-1">
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
              <span className="hidden sm:inline">Cart</span>
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
            <nav className="space-y-2">
              <Link
                href="/products"
                className="block py-2 text-gray-900 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/products?category=dresses"
                className="block py-2 text-gray-900 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Dresses
              </Link>
              <Link
                href="/products?category=tops"
                className="block py-2 text-gray-900 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Tops
              </Link>
              <Link
                href="/products?category=bottoms"
                className="block py-2 text-gray-900 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Bottoms
              </Link>
              <Link
                href="/products?category=accessories"
                className="block py-2 text-gray-900 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
