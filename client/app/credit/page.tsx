"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CreditTypeSelection from "@/components/credit/credit-type-selection"
import CreditSimulation from "@/components/credit/credit-simulation"
import PersonalInfoForm from "@/components/credit/personal-info-form"
import ProfessionalInfoForm from "@/components/credit/professional-info-form"
import FinancialInfoForm from "@/components/credit/financial-info-form"
import AgencySelection from "@/components/credit/agency-selection"
import DocumentUpload from "@/components/credit/document-upload"
import CreditSummary from "@/components/credit/credit-summary"
import StepIndicator from "@/components/credit/step-indicator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export default function CreditPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCredit, setSelectedCredit] = useState<string | null>(null)
  const [creditData, setCreditData] = useState({
    // Credit simulation data
    creditType: "",
    creditAmount: 0,
    duration: 12,
    monthlyPayment: 0,

    // Personal info
    personalInfo: {
      firstName: "",
      lastName: "",
      cin: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      address: "",
    },

    // Professional info
    professionalInfo: {
      profession: "",
      company: "",
      contractType: "",
      seniority: "",
    },

    // Financial info
    financialInfo: {
      monthlyIncome: 0,
      otherIncome: 0,
      loanAmount: 0,
      monthlyExpenses: 0,
    },

    // Agency info
    agencyInfo: {
      governorate: "",
      city: "",
      agency: "",
    },
  })

  const handleCreditTypeSelect = (creditType: string) => {
    setSelectedCredit(creditType)
    setCreditData((prev) => ({
      ...prev,
      creditType,
    }))
    setCurrentStep(2)
  }

  const handleSimulationComplete = (simulationData: any) => {
    setCreditData((prev) => ({
      ...prev,
      creditAmount: simulationData.amount,
      duration: simulationData.duration,
      monthlyPayment: simulationData.monthlyPayment,
    }))
    setCurrentStep(3)
  }

  const handlePersonalInfoSubmit = (personalInfo: any) => {
    setCreditData((prev) => ({
      ...prev,
      personalInfo,
    }))
    setCurrentStep(4)
  }

  const handleProfessionalInfoSubmit = (professionalInfo: any) => {
    setCreditData((prev) => ({
      ...prev,
      professionalInfo,
    }))
    setCurrentStep(5)
  }

  const handleFinancialInfoSubmit = (financialInfo: any) => {
    setCreditData((prev) => ({
      ...prev,
      financialInfo,
    }))
    setCurrentStep(6)
  }

  const handleAgencyInfoSubmit = (agencyInfo: any) => {
    setCreditData((prev) => ({
      ...prev,
      agencyInfo,
    }))
    setCurrentStep(7)
  }

  // Update the handleDocumentSubmit function to match the schema structure
  const handleDocumentSubmit = async (documents: {
    cinRecto: string | null
    cinVerso: string | null
    bankStatements: string | null
    taxDeclaration: string | null
    incomeProof: string | null
    businessRegistry: string | null
    residenceProof: string | null
  }) => {
    try {
      // Add the uploaded document URLs directly to the credit data
      const creditDataWithDocuments = {
        ...creditData,
        documents, // This now matches your schema structure
      }

      const response = await axios.post("http://localhost:5000/api/req/credits", creditDataWithDocuments)

      toast({
        title: "Demande soumise avec succès",
        description: "Votre demande de crédit a été envoyée. Nous vous contacterons bientôt.",
      })

      // Redirect to confirmation page or dashboard
      router.push("/credit/confirmation")
    } catch (error) {
      console.error("Error submitting credit application:", error)
      toast({
        title: "Erreur lors de la soumission",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CreditTypeSelection onSelect={handleCreditTypeSelect} />
      case 2:
        return (
          <CreditSimulation
            creditType={selectedCredit || ""}
            onComplete={handleSimulationComplete}
            onBack={goToPreviousStep}
          />
        )
      case 3:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            onBack={goToPreviousStep}
            initialData={creditData.personalInfo}
          />
        )
      case 4:
        return (
          <ProfessionalInfoForm
            onSubmit={handleProfessionalInfoSubmit}
            onBack={goToPreviousStep}
            initialData={creditData.professionalInfo}
          />
        )
      case 5:
        return (
          <FinancialInfoForm
            onSubmit={handleFinancialInfoSubmit}
            onBack={goToPreviousStep}
            initialData={creditData.financialInfo}
          />
        )
      case 6:
        return (
          <AgencySelection
            onSubmit={handleAgencyInfoSubmit}
            onBack={goToPreviousStep}
            initialData={creditData.agencyInfo}
          />
        )
      case 7:
        return <DocumentUpload onSubmit={handleDocumentSubmit} onBack={goToPreviousStep} />
      default:
        return <CreditTypeSelection onSelect={handleCreditTypeSelect} />
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Demande de Crédit</h1>

        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 mb-16">{renderCurrentStep()}</div>

        {currentStep === 2 && selectedCredit && (
          <CreditSummary
            creditType={selectedCredit}
            amount={creditData.creditAmount}
            duration={creditData.duration}
            monthlyPayment={creditData.monthlyPayment}
          />
        )}
      </div>
      <Footer />
    </main>
  )
}
