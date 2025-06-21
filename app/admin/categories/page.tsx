"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Category, User } from "@/lib/types"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminCategoriesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
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
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCategory) {
        const { error } = await supabase.from("categories").update(formData).eq("id", editingCategory.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("categories").insert(formData)
        if (error) throw error
      }

      await fetchCategories()
      setShowForm(false)
      setEditingCategory(null)
      setFormData({
        name: "",
        description: "",
        image_url: "",
      })
      alert(editingCategory ? "Category updated successfully!" : "Category created successfully!")
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Error saving category. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error

      await fetchCategories()
      alert("Category deleted successfully!")
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error deleting category. Please try again.")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of the category"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/category-image.jpg"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                    setFormData({
                      name: "",
                      description: "",
                      image_url: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  {category.description && <p className="text-gray-600 mb-4">{category.description}</p>}
                  {category.image_url && (
                    <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-4">
                      <img
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Created: {new Date(category.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(category)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first category.</p>
          <Button onClick={() => setShowForm(true)}>Add Category</Button>
        </div>
      )}
    </div>
  )
}
