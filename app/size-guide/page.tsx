import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Info } from "lucide-react"

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
        <p className="text-xl text-gray-600">Find your perfect fit with our comprehensive sizing guide</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            How to Measure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Taking Your Measurements</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Use a soft measuring tape</li>
                <li>• Measure over light clothing or undergarments</li>
                <li>• Keep the tape snug but not tight</li>
                <li>• Stand straight with arms at your sides</li>
                <li>• Ask someone to help for accurate measurements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Measurements</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>Bust:</strong> Around the fullest part of your chest
                </li>
                <li>
                  • <strong>Waist:</strong> Around the narrowest part of your waist
                </li>
                <li>
                  • <strong>Hips:</strong> Around the fullest part of your hips
                </li>
                <li>
                  • <strong>Length:</strong> From shoulder to desired hem length
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tops & Dresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Size</th>
                    <th className="text-left py-2 font-semibold">Bust (inches)</th>
                    <th className="text-left py-2 font-semibold">Waist (inches)</th>
                    <th className="text-left py-2 font-semibold">Hips (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">XS</td>
                    <td className="py-2">30-32</td>
                    <td className="py-2">24-26</td>
                    <td className="py-2">34-36</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">S</td>
                    <td className="py-2">32-34</td>
                    <td className="py-2">26-28</td>
                    <td className="py-2">36-38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">M</td>
                    <td className="py-2">34-36</td>
                    <td className="py-2">28-30</td>
                    <td className="py-2">38-40</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">L</td>
                    <td className="py-2">36-38</td>
                    <td className="py-2">30-32</td>
                    <td className="py-2">40-42</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">XL</td>
                    <td className="py-2">38-40</td>
                    <td className="py-2">32-34</td>
                    <td className="py-2">42-44</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">XXL</td>
                    <td className="py-2">40-42</td>
                    <td className="py-2">34-36</td>
                    <td className="py-2">44-46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Size</th>
                    <th className="text-left py-2 font-semibold">Waist (inches)</th>
                    <th className="text-left py-2 font-semibold">Hips (inches)</th>
                    <th className="text-left py-2 font-semibold">Inseam (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">XS</td>
                    <td className="py-2">24-26</td>
                    <td className="py-2">34-36</td>
                    <td className="py-2">28-30</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">S</td>
                    <td className="py-2">26-28</td>
                    <td className="py-2">36-38</td>
                    <td className="py-2">28-30</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">M</td>
                    <td className="py-2">28-30</td>
                    <td className="py-2">38-40</td>
                    <td className="py-2">29-31</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">L</td>
                    <td className="py-2">30-32</td>
                    <td className="py-2">40-42</td>
                    <td className="py-2">29-31</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">XL</td>
                    <td className="py-2">32-34</td>
                    <td className="py-2">42-44</td>
                    <td className="py-2">30-32</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">XXL</td>
                    <td className="py-2">34-36</td>
                    <td className="py-2">44-46</td>
                    <td className="py-2">30-32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Fit Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Regular Fit</h4>
              <p className="text-gray-600 text-sm">
                Our standard fit that follows the body's natural silhouette without being too tight or too loose.
                Perfect for everyday wear.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Relaxed Fit</h4>
              <p className="text-gray-600 text-sm">
                A looser, more comfortable fit with extra room through the body. Ideal for casual, comfortable styling.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fitted</h4>
              <p className="text-gray-600 text-sm">
                A closer-to-body fit that accentuates your silhouette. Perfect for a more tailored, elegant look.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Size Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">SAYA</th>
                    <th className="text-left py-2 font-semibold">US</th>
                    <th className="text-left py-2 font-semibold">UK</th>
                    <th className="text-left py-2 font-semibold">EU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">XS</td>
                    <td className="py-2">0-2</td>
                    <td className="py-2">4-6</td>
                    <td className="py-2">32-34</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">S</td>
                    <td className="py-2">4-6</td>
                    <td className="py-2">8-10</td>
                    <td className="py-2">36-38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">M</td>
                    <td className="py-2">8-10</td>
                    <td className="py-2">12-14</td>
                    <td className="py-2">40-42</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">L</td>
                    <td className="py-2">12-14</td>
                    <td className="py-2">16-18</td>
                    <td className="py-2">44-46</td>
                  </tr>
                  <tr>
                    <td className="py-2">XL</td>
                    <td className="py-2">16-18</td>
                    <td className="py-2">20-22</td>
                    <td className="py-2">48-50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sizing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-600">
              <li>• When between sizes, size up for a more comfortable fit</li>
              <li>• Check individual product descriptions for specific fit notes</li>
              <li>• Consider the fabric - stretchy materials may fit differently</li>
              <li>• Contact us on WhatsApp if you need sizing advice</li>
              <li>• Remember our easy exchange policy if the size isn't perfect</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Can't find your size or need personalized sizing advice? Our team is here to help you find the perfect fit!
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
