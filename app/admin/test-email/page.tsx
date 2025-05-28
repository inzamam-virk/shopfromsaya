"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"

export default function TestEmailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [message, setMessage] = useState("")
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
      setTestEmail(userData.email || "")
    }

    checkAdmin()
  }, [router])

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage("Please enter an email address")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testEmail }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`✅ ${result.message}`)
      } else {
        setMessage(`❌ Error: ${result.error}${result.details ? ` - ${result.details}` : ""}`)
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Email Configuration</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email to test"
            />
          </div>

          <Button onClick={handleTestEmail} disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Test Email"}
          </Button>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Email Configuration:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ SMTP configuration is set up via environment variables</p>
              <p>📧 Test the configuration by sending an email above</p>
              <p>🔧 If emails fail, check your SMTP credentials in Vercel settings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
