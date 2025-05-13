"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">À Propos de BH BANK</h1>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Image
              src="/images/home.jpg"
              alt="BH BANK Logo"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
            <p className="mb-4">
              Fondée avec une vision claire de transformer le paysage bancaire, BH BANK s'est établie comme une
              institution financière de premier plan, offrant des services bancaires innovants et fiables à nos clients.
            </p>
            <p>
              Depuis notre création, nous nous sommes engagés à fournir des solutions financières exceptionnelles, en
              mettant l'accent sur l'innovation, la sécurité et la satisfaction client.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Notre Mission</h2>
          <p className="text-center max-w-3xl mx-auto">
            Notre mission est de fournir des services financiers accessibles, innovants et sécurisés qui répondent aux
            besoins évolutifs de nos clients, tout en contribuant au développement économique durable de notre
            communauté.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p>Nous adoptons les dernières technologies pour offrir des solutions bancaires modernes et efficaces.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Intégrité</h3>
            <p>Nous opérons avec les plus hauts standards d'éthique et de transparence dans toutes nos interactions.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p>
              Nous nous efforçons d'exceller dans tous les aspects de nos services pour dépasser les attentes de nos
              clients.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
