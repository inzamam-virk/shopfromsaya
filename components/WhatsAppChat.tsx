"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppChat() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/923149363244?text=Hello%20SAYA", "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
      size="sm"
    >
      <MessageCircle className="h-6 w-6 text-white" />
      <span className="sr-only">Chat on WhatsApp</span>
    </Button>
  )
}
