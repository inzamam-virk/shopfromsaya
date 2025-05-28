import { type NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const testEmail = body.testEmail || "test@example.com"

    // Test email data
    const testOrderData = {
      orderId: "test-order-" + Date.now(),
      customerEmail: testEmail,
      customerName: "Test Customer",
      orderItems: [
        {
          name: "Elegant Maxi Dress",
          quantity: 1,
          price: 89.99,
        },
        {
          name: "Casual Cotton Top",
          quantity: 2,
          price: 34.99,
        },
      ],
      totalAmount: 159.97,
      shippingAddress: {
        street: "123 Fashion Street",
        city: "Karachi",
        state: "Sindh",
        postal_code: "75500",
        country: "Pakistan",
      },
      paymentMethod: "cod",
    }

    await sendOrderConfirmationEmail(testOrderData)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
