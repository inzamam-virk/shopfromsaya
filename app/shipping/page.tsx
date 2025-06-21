import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Clock, MapPin } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        <p className="text-xl text-gray-600">Everything you need to know about our delivery process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Nationwide Delivery</h4>
                <p className="text-gray-600">We deliver to all major cities across Pakistan</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Major Cities</h4>
                <p className="text-gray-600">Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Other Cities</h4>
                <p className="text-gray-600">Available via courier services</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Delivery Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Karachi</h4>
                <p className="text-gray-600">1-2 business days</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Major Cities</h4>
                <p className="text-gray-600">2-3 business days</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Other Cities</h4>
                <p className="text-gray-600">3-5 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipping Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Location</th>
                  <th className="text-left py-3 px-4 font-semibold">Standard Delivery</th>
                  <th className="text-left py-3 px-4 font-semibold">Express Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Karachi</td>
                  <td className="py-3 px-4">Rs. 200</td>
                  <td className="py-3 px-4">Rs. 350</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Lahore, Islamabad</td>
                  <td className="py-3 px-4">Rs. 300</td>
                  <td className="py-3 px-4">Rs. 500</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Other Major Cities</td>
                  <td className="py-3 px-4">Rs. 350</td>
                  <td className="py-3 px-4">Rs. 600</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Remote Areas</td>
                  <td className="py-3 px-4">Rs. 450</td>
                  <td className="py-3 px-4">Not Available</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">* Free shipping on orders over Rs. 5,000 within major cities</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Processing Time</h4>
                <p className="text-gray-600">Orders are processed within 1-2 business days after confirmation.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Confirmation</h4>
                <p className="text-gray-600">
                  You'll receive a WhatsApp message confirming your order and payment details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tracking</h4>
                <p className="text-gray-600">
                  Once shipped, you'll receive tracking information via WhatsApp to monitor your delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cash on Delivery</h4>
                <p className="text-gray-600">Pay when you receive your order. Available in most areas.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer</h4>
                <p className="text-gray-600">
                  Pre-payment required. Orders ship immediately after payment confirmation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Attempt</h4>
                <p className="text-gray-600">
                  Our courier will contact you before delivery. Please ensure someone is available to receive the
                  package.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-600">
            <li>• Delivery times may vary during peak seasons and holidays</li>
            <li>• Remote areas may require additional delivery time</li>
            <li>• Please provide accurate contact information for smooth delivery</li>
            <li>• Packages are insured against loss or damage during transit</li>
            <li>• For urgent deliveries, please contact us via WhatsApp</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
