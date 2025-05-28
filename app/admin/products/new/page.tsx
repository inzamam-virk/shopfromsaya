"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Category, User } from "@/lib/types"

export default function NewProductPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category_id: "",
    price: "",
    weight: "",
    inventory_count: "",
    images: "",
    tags: "",
    featured: false,
  })
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/auth")
        return
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
      if (!userData || userData.role !== "admin") {
        router.push("/products")
        return
      }

      setUser(userData)
      await fetchCategories()
    }

    checkAdmin()
  }, [router])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name")
    setCategories(data || [])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        category_id: formData.category_id,
        price: Number.parseFloat(formData.price),
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        inventory_count: Number.parseInt(formData.inventory_count),
        images: formData.images ? formData.images.split(",").map((url) => url.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
        featured: formData.featured,
      }

      const { error } = await supabase.from("products").insert(productData)
      if (error) throw error

      alert("Product created successfully!")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Error creating product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="inventory_count">Inventory Count *</Label>
                <Input
                  id="inventory_count"
                  name="inventory_count"
                  type="number"
                  value={formData.inventory_count}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Textarea
                id="images"
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="casual, summer, cotton"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
