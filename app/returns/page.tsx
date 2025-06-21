import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Clock, CheckCircle, XCircle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
        <p className="text-xl text-gray-600">Your satisfaction is our priority</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Return Policy Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We want you to love your SAYA purchase! If you're not completely satisfied, we offer a hassle-free return
            and exchange policy to ensure your shopping experience is exceptional.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">7-Day Return Window</h4>
            <p className="text-blue-800">
              You have 7 days from the delivery date to initiate a return or exchange request.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Items in original condition with tags attached</li>
              <li>• Unworn and unwashed items</li>
              <li>• Items in original packaging</li>
              <li>• Defective or damaged items</li>
              <li>• Wrong size or color received</li>
              <li>• Items that don't match the description</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Not Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Items worn or washed</li>
              <li>• Items without original tags</li>
              <li>• Damaged due to misuse</li>
              <li>• Items returned after 7 days</li>
              <li>• Customized or personalized items</li>
              <li>• Undergarments and intimate wear</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Return Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Contact Us</h4>
                <p className="text-gray-600">
                  Message us on WhatsApp at +92 314 936 3244 within 7 days of delivery to initiate your return.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Return Authorization</h4>
                <p className="text-gray-600">
                  Our team will review your request and provide return instructions if eligible.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Package & Send</h4>
                <p className="text-gray-600">
                  Carefully package the item(s) with original tags and send via our provided courier service.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Processing</h4>
                <p className="text-gray-600">
                  Once we receive your return, we'll inspect the item(s) and process your refund or exchange within 3-5
                  business days.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Refund Method</h4>
                <p className="text-gray-600">
                  Refunds will be processed via bank transfer to your provided account details.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Processing Time</h4>
                <p className="text-gray-600">Refunds typically take 3-5 business days to reflect in your account.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Costs</h4>
                <p className="text-gray-600">
                  Original shipping costs are non-refundable unless the return is due to our error.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Size Exchanges</h4>
                <p className="text-gray-600">
                  Free size exchanges within 7 days, subject to availability of the requested size.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Color Exchanges</h4>
                <p className="text-gray-600">
                  Color exchanges are available if the new item is the same price or higher.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Processing Time</h4>
                <p className="text-gray-600">
                  Exchanges are processed within 3-5 business days after we receive your return.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you have any questions about returns or exchanges, our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/923149363244"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              WhatsApp: +92 314 936 3244
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
