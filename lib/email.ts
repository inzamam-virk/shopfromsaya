import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
})

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP configuration error:", error)
  } else {
    console.log("SMTP server is ready to send emails")
  }
})

export async function sendOrderConfirmationEmail(orderData: {
  orderId: string
  customerEmail: string
  customerName: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  shippingAddress: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  paymentMethod: string
}) {
  const { orderId, customerEmail, customerName, orderItems, totalAmount, shippingAddress, paymentMethod } = orderData

  const itemsHtml = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - SAYA</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin-bottom: 10px;">SAYA</h1>
        <h2 style="color: #27ae60; margin-top: 0;">Order Confirmation</h2>
      </div>

      <p>Dear ${customerName},</p>
      
      <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Order Details</h3>
        <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
      </div>

      <h3 style="color: #2c3e50;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #dee2e6;">Total Amount:</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #dee2e6;">$${totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="color: #2c3e50;">Shipping Address</h3>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0;">
          ${shippingAddress.street}<br>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}<br>
          ${shippingAddress.country}
        </p>
      </div>

      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #27ae60;">What's Next?</h3>
        <p style="margin-bottom: 0;">We'll contact you via WhatsApp for order updates and delivery coordination. Our team will reach out to you soon with tracking information and delivery details.</p>
      </div>

      <p>If you have any questions about your order, please don't hesitate to contact us via WhatsApp at +92 314 936 3244.</p>
      
      <p>Thank you for choosing SAYA!</p>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          SAYA - Soft & Chic Fashion for Women<br>
          <a href="https://wa.me/923149363244" style="color: #27ae60;">WhatsApp: +92 314 936 3244</a>
        </p>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"SAYA Fashion" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation - SAYA #${orderId.slice(0, 8)}`,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Order confirmation email sent successfully")
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    throw error
  }
}
