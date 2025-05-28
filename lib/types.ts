export interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  shipping_address?: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  sku: string
  category_id: string
  category?: Category
  price: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  inventory_count: number
  images: string[]
  advertisement_image?: string
  thumbnails: string[]
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
  reviews?: Review[]
  average_rating?: number
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  user?: User
  rating: number
  comment: string
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id?: string
  guest_name?: string
  guest_email?: string
  guest_phone: string
  shipping_address: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  payment_method: "cod" | "bank_transfer"
  payment_proof?: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
  created_at: string
}

export interface Advertisement {
  id: string
  title: string
  image_url: string
  link_url?: string
  overlay_text?: string
  active: boolean
  sort_order: number
  created_at: string
}
