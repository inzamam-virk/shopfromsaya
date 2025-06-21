import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              By accessing and using the SAYA website, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products and Services</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ul>
              <li>All products are subject to availability</li>
              <li>We reserve the right to limit quantities and discontinue products</li>
              <li>Product colors may vary slightly from images due to screen settings</li>
              <li>We strive to provide accurate product descriptions and pricing</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders and Payment</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ul>
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel orders</li>
              <li>Payment must be made in full before shipping (except COD orders)</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping and Delivery</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ul>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery</li>
              <li>You are responsible for providing accurate delivery information</li>
              <li>Additional charges may apply for remote locations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Returns and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ul>
              <li>Returns must be initiated within 7 days of delivery</li>
              <li>Items must be in original condition with tags attached</li>
              <li>Return shipping costs may apply</li>
              <li>Refunds will be processed within 3-5 business days</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              SAYA shall not be liable for any indirect, incidental, special, or consequential damages arising from the
              use of our products or services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>For questions about these Terms of Service, please contact us:</p>
            <div className="mt-4 space-y-2">
              <p>WhatsApp: +92 314 936 3244</p>
              <p>Email: info@saya.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
