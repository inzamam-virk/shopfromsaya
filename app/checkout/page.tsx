"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    paymentMethod: "cod" as "cod" | "bank_transfer",
    paymentProof: null as File | null,
  })

  const { state, clearCart, getTotalPrice } = useCart()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (userData) {
          setUser(userData)
          if (userData.shipping_address) {
            const addressParts = userData.shipping_address.street?.split(',') || []
            setFormData((prev) => ({
              ...prev,
              addressLine1: addressParts[0]?.trim() || "",
              addressLine2: addressParts[1]?.trim() || "",
              city: userData.shipping_address.city || "",
              state: userData.shipping_address.state || "",
              postalCode: userData.shipping_address.postal_code || "",
              country: userData.shipping_address.country || "",
            }))
          }
        }
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/products")
    }
  }, [state.items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, paymentProof: file }))
  }

  const handleSubmitOrder = async () => {
    setLoading(true)

    try {
      // Validate required fields
      if (!user && (!formData.guestName || !formData.guestPhone)) {
        alert("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
        alert("Please fill in all shipping address fields")
        setLoading(false)
        return
      }

      if (formData.paymentMethod === "bank_transfer" && !formData.paymentProof) {
        alert("Please upload payment proof for bank transfer")
        setLoading(false)
        return
      }

      let paymentProofUrl = null

      // Upload payment proof if bank transfer
      if (formData.paymentMethod === "bank_transfer" && formData.paymentProof) {
        const fileExt = formData.paymentProof.name.split(".").pop()
        const fileName = `payment-proof-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, formData.paymentProof)

        if (uploadError) throw uploadError
        paymentProofUrl = uploadData.path
      }

      // Create order
      const orderData = {
        user_id: user?.id || null,
        guest_name: user ? user.full_name : formData.guestName,
        guest_email: user ? user.email : formData.guestEmail,
        guest_phone: user ? user.phone_number : formData.guestPhone,
        shipping_address: {
          street: `${formData.addressLine1}${formData.addressLine2 ? `, ${formData.addressLine2}` : ''}`,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
        },
        total_amount: getTotalPrice(),
        payment_method: formData.paymentMethod,
        payment_proof: paymentProofUrl,
        status: "pending",
      }

      const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = state.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Send order confirmation email (only if email is provided)
      const customerEmail = user?.email || formData.guestEmail
      if (customerEmail) {
        try {
          const emailResponse = await fetch("/api/send-order-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order.id,
              customerEmail: customerEmail,
              customerName: user?.full_name || formData.guestName,
              orderItems: state.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              })),
              totalAmount: getTotalPrice(),
              shippingAddress: {
                street: `${formData.addressLine1}${formData.addressLine2 ? `, ${formData.addressLine2}` : ''}`,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                country: formData.country,
              },
              paymentMethod: formData.paymentMethod,
            }),
          })

          if (!emailResponse.ok) {
            console.error("Email sending failed, but order was created successfully")
          }
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError)
          // Don't fail the order if email fails
        }
      }

      // Clear cart and redirect
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error creating order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Step 1: Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user && (
                <>
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      name="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestPhone">Phone Number *</Label>
                    <Input
                      id="guestPhone"
                      name="guestPhone"
                      type="tel"
                      value={formData.guestPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: value as "cod" | "bank_transfer" }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer">Bank Transfer</Label>
                </div>
              </RadioGroup>

              {formData.paymentMethod === "bank_transfer" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Bank Details:</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Bank: HBL Bank
                    <br />
                    Account Name: SAYA Fashion
                    <br />
                    Account Number: 1234567890
                    <br />
                    IBAN: PK12HABB1234567890123456
                  </p>
                  <div className="mt-4">
                    <Label htmlFor="paymentProof">Upload Payment Proof *</Label>
                    <Input id="paymentProof" type="file" accept="image/*,.pdf" onChange={handleFileChange} required />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSubmitOrder} disabled={loading} className="w-full" size="lg">
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
