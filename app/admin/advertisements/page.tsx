"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Advertisement, User } from "@/lib/types"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"

export default function AdminAdvertisementsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    overlay_text: "",
    active: true,
    sort_order: 1,
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
      await fetchAdvertisements()
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase.from("advertisements").select("*").order("sort_order", { ascending: true })

      if (error) throw error
      setAdvertisements(data || [])
    } catch (error) {
      console.error("Error fetching advertisements:", error)
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
      const adData = {
        ...formData,
        sort_order: Number.parseInt(formData.sort_order.toString()),
      }

      if (editingAd) {
        const { error } = await supabase.from("advertisements").update(adData).eq("id", editingAd.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("advertisements").insert(adData)
        if (error) throw error
      }

      await fetchAdvertisements()
      setShowForm(false)
      setEditingAd(null)
      setFormData({
        title: "",
        image_url: "",
        link_url: "",
        overlay_text: "",
        active: true,
        sort_order: 1,
      })
      alert(editingAd ? "Advertisement updated successfully!" : "Advertisement created successfully!")
    } catch (error) {
      console.error("Error saving advertisement:", error)
      alert("Error saving advertisement. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      overlay_text: ad.overlay_text || "",
      active: ad.active,
      sort_order: ad.sort_order,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    try {
      const { error } = await supabase.from("advertisements").delete().eq("id", id)
      if (error) throw error

      await fetchAdvertisements()
      alert("Advertisement deleted successfully!")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      alert("Error deleting advertisement. Please try again.")
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("advertisements").update({ active: !currentStatus }).eq("id", id)
      if (error) throw error

      await fetchAdvertisements()
    } catch (error) {
      console.error("Error updating advertisement status:", error)
      alert("Error updating advertisement status. Please try again.")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Advertisement
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingAd ? "Edit Advertisement" : "Add New Advertisement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="link_url">Link URL (optional)</Label>
                <Input
                  id="link_url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/page"
                />
              </div>

              <div>
                <Label htmlFor="overlay_text">Overlay Text</Label>
                <Textarea
                  id="overlay_text"
                  name="overlay_text"
                  value={formData.overlay_text}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Text to display over the image"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: !!checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingAd ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAd(null)
                    setFormData({
                      title: "",
                      image_url: "",
                      link_url: "",
                      overlay_text: "",
                      active: true,
                      sort_order: 1,
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

      {/* Advertisements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-4">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={ad.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                {ad.overlay_text && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <p className="text-white text-center font-semibold">{ad.overlay_text}</p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant={ad.active ? "default" : "secondary"}
                    onClick={() => toggleActive(ad.id, ad.active)}
                  >
                    {ad.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{ad.title}</h3>
                <p className="text-sm text-gray-600">Sort Order: {ad.sort_order}</p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className={ad.active ? "text-green-600" : "text-red-600"}>
                    {ad.active ? "Active" : "Inactive"}
                  </span>
                </p>
                {ad.link_url && <p className="text-sm text-blue-600 truncate">Link: {ad.link_url}</p>}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(ad)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(ad.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {advertisements.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first advertisement.</p>
          <Button onClick={() => setShowForm(true)}>Add Advertisement</Button>
        </div>
      )}
    </div>
  )
}
