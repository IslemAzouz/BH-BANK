"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { sender: "admin", text: "Bonjour ! Comment puis-je vous aider aujourd’hui ?" },
  ])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const handleSend = () => {
    if (!input.trim()) return

    const newMessages = [...messages, { sender: "user", text: input.trim() }]
    setMessages(newMessages)
    setInput("")

    // Simulated admin reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: input.trim() },
        {
          sender: "admin",
          text: "Merci pour votre message ! Un agent va vous répondre sous peu.",
        },
      ])
    }, 1000)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <section className="bg-muted py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Chat en direct</h2>
        <div className="border rounded-lg bg-white p-4 h-96 overflow-y-auto space-y-3 shadow-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 text-sm max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-1" />
            Envoyer
          </Button>
        </div>
      </div>
    </section>
  )
}
