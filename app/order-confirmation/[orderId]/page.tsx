import { supabase } from "@/lib/supabase"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderConfirmationPageProps {
  params: {
    orderId: string
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("id", params.orderId)
    .single()

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order. We'll send you updates via WhatsApp.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Order ID:</span>
              <p className="text-gray-600">{order.id}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <p className="text-gray-600 capitalize">{order.status}</p>
            </div>
            <div>
              <span className="font-medium">Payment Method:</span>
              <p className="text-gray-600">{order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
            </div>
            <div>
              <span className="font-medium">Total Amount:</span>
              <p className="text-gray-600">${order.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <span className="font-medium">Shipping Address:</span>
            <p className="text-gray-600">
              {order.shipping_address.street}
              <br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              <br />
              {order.shipping_address.country}
            </p>
          </div>

          <div>
            <span className="font-medium">Items:</span>
            <div className="mt-2 space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-gray-600">We'll contact you on WhatsApp for order updates and delivery coordination.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
