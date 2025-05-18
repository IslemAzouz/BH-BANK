import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import CreditSection from "@/components/credit-section"
import ChatSection from "@/components/chat-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <ServicesSection />
        <CreditSection />
        <ChatSection />
      </div>
      <Footer />
    </main>
  )
}
