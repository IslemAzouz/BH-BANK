"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Info, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [creditApplications, setCreditApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

  // Modifions la fonction fetchCreditApplications pour ajouter plus de débogage
  const fetchCreditApplications = async (cin: string, token: string) => {
    try {
      setIsLoading(true)

      console.log("Tentative de récupération des crédits avec:", {
        cin,
        tokenExists: !!token,
        tokenLength: token?.length,
      })

      // Appel à l'API pour récupérer les demandes de crédit
      const response = await axios.get(`http://localhost:5000/api/req/credits/cin/${cin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Réponse de l'API:", response.data)

      if (response.data && Array.isArray(response.data)) {
        setCreditApplications(response.data)
      } else {
        console.warn("Les données reçues ne sont pas un tableau:", response.data)
        setCreditApplications([])
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des demandes de crédit:", error.message)

      setCreditApplications([])

      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos demandes de crédit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Modifions également la partie useEffect pour mieux déboguer
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    console.log("État de l'authentification:", {
      tokenExists: !!token,
      userDataExists: !!userData,
    })

    if (!token || !userData) {
      console.log("Redirection vers login: token ou userData manquant")
      router.push("/login")
      return
    }

    // Fonction asynchrone à l'intérieur du useEffect
    const initializeUser = async () => {
      try {
        const parsedUser = JSON.parse(userData)
        console.log("Données utilisateur:", {
          email: parsedUser.email,
          cin: parsedUser.CIN,
          hasValidCIN: !!parsedUser.CIN && typeof parsedUser.CIN === "string",
        })

        setUser(parsedUser)

        // Récupérer les demandes de crédit
        // Vérifier si le CIN existe dans l'objet utilisateur ou s'il est stocké sous un autre nom
        const userCIN = parsedUser.CIN || parsedUser.cin || parsedUser.id || ""

        if (userCIN) {
          console.log("Utilisation du CIN:", userCIN)
          fetchCreditApplications(userCIN, token)
        } else {
          // Si le CIN n'est toujours pas disponible, essayons de le récupérer du formulaire de connexion
          console.error("CIN manquant dans les données utilisateur, tentative de récupération du profil")

          // Essayer de récupérer le profil utilisateur pour obtenir le CIN
          try {
            const profileResponse = await axios.get("http://localhost:5000/auth/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (profileResponse.data && (profileResponse.data.CIN || profileResponse.data.cin)) {
              const profileCIN = profileResponse.data.CIN || profileResponse.data.cin
              console.log("CIN récupéré du profil:", profileCIN)

              // Mettre à jour les données utilisateur dans le localStorage
              const updatedUser = { ...parsedUser, CIN: profileCIN }
              localStorage.setItem("user", JSON.stringify(updatedUser))
              setUser(updatedUser)

              fetchCreditApplications(profileCIN, token)
            } else {
              throw new Error("CIN non trouvé dans le profil")
            }
          } catch (profileError: any) {
            console.error("Erreur lors de la récupération du profil:", profileError)
            toast({
              title: "Erreur",
              description: "Impossible de récupérer vos informations de profil",
              variant: "destructive",
            })
          }
        }
      } catch (error: any) {
        console.error("Erreur lors de l'analyse des données utilisateur:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    }

    // Appeler la fonction asynchrone
    initializeUser()
  }, [router])

  const getCreditTypeName = (type: string) => {
    switch (type) {
      case "CREDIT_CONSOMMATION":
        return "Crédit Consommation"
      case "CREDIT_AMENAGEMENT":
        return "Crédit Aménagement"
      case "CREDIT_ORDINATEUR":
        return "Crédit Ordinateur"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approuvé":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("dashboard.approved")}
          </Badge>
        )
      case "rejeté":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            {t("dashboard.rejected")}
          </Badge>
        )
      case "en attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" />
            {t("dashboard.pending")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    toast({
      title: t("dashboard.logoutSuccess"),
      description: t("dashboard.logoutMessage"),
    })

    router.push("/")
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("dashboard.myCredits")}</h1>
            {user && (
              <p className="text-muted-foreground">
                {t("dashboard.welcome")}, {user.email || user.CIN}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link href="/credit">
                <Plus className="mr-2 h-4 w-4" />
                {t("dashboard.newApplication")}
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              {t("nav.logout")}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.myCredits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">{t("dashboard.allApplications")}</TabsTrigger>
                  <TabsTrigger value="pending">{t("dashboard.pendingApplications")}</TabsTrigger>
                  <TabsTrigger value="approved">{t("dashboard.approvedApplications")}</TabsTrigger>
                  <TabsTrigger value="rejected">{t("dashboard.rejectedApplications")}</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {renderCreditApplicationsList(creditApplications, isLoading)}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  {renderCreditApplicationsList(
                    creditApplications.filter((app) => app.status === "en attente"),
                    isLoading,
                  )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  {renderCreditApplicationsList(
                    creditApplications.filter((app) => app.status === "approuvé"),
                    isLoading,
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  {renderCreditApplicationsList(
                    creditApplications.filter((app) => app.status === "rejeté"),
                    isLoading,
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )

  function renderCreditApplicationsList(applications: any[], isLoading: boolean) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (applications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("dashboard.noApplicationsFound")}</h3>
          <p className="text-muted-foreground mb-6">{t("dashboard.noApplicationsDescription")}</p>
          <Button asChild>
            <Link href="/credit">
              <CreditCard className="mr-2 h-4 w-4" />
              {t("dashboard.applyNow")}
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{getCreditTypeName(application.creditType)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.applicationId")}: {application.id} • {t("dashboard.submittedOn")}:{" "}
                    {formatDate(application.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">{getStatusBadge(application.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">{t("dashboard.amount")}:</span>
                  <span className="ml-2">{application.creditAmount.toLocaleString()} DT</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">{t("dashboard.duration")}:</span>
                  <span className="ml-2">
                    {application.duration} {t("credit.months")}
                  </span>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">{t("dashboard.monthlyPayment")}:</span>
                  <span className="ml-2">{application.monthlyPayment.toFixed(2)} DT/mois</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedApplication(application)}>
                    <Info className="mr-2 h-4 w-4" />
                    {t("dashboard.viewDetails")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("dashboard.applicationDetails")}</DialogTitle>
                  </DialogHeader>

                  <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">{t("dashboard.creditType")}:</span>
                          <span className="ml-2">{getCreditTypeName(application.creditType)}</span>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">{t("dashboard.amount")}:</span>
                          <span className="ml-2">{application.creditAmount.toLocaleString()} DT</span>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">{t("dashboard.duration")}:</span>
                          <span className="ml-2">
                            {application.duration} {t("credit.months")}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">{t("dashboard.status")}:</span>
                          <span className="ml-2">{getStatusBadge(application.status)}</span>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">{t("dashboard.monthlyPayment")}:</span>
                          <span className="ml-2">{application.monthlyPayment.toFixed(2)} DT/mois</span>
                        </div>

                        {application.status === "rejeté" && application.rejectionReason && (
                          <div className="flex items-start">
                            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                            <div>
                              <span className="font-medium">{t("dashboard.rejectionReason")}:</span>
                              <p className="text-muted-foreground">{application.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {application.personalInfo && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">{t("dashboard.personalInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
                          {application.personalInfo.lastName && (
                            <div>
                              <p className="text-sm text-muted-foreground">{t("credit.lastName")}</p>
                              <p className="font-medium">{application.personalInfo.lastName}</p>
                            </div>
                          )}
                          {application.personalInfo.firstName && (
                            <div>
                              <p className="text-sm text-muted-foreground">{t("credit.firstName")}</p>
                              <p className="font-medium">{application.personalInfo.firstName}</p>
                            </div>
                          )}
                          {application.personalInfo.cin && (
                            <div>
                              <p className="text-sm text-muted-foreground">{t("credit.cin")}</p>
                              <p className="font-medium">{application.personalInfo.cin}</p>
                            </div>
                          )}
                          {application.personalInfo.phone && (
                            <div>
                              <p className="text-sm text-muted-foreground">{t("credit.phone")}</p>
                              <p className="font-medium">{application.personalInfo.phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {application.timeline && application.timeline.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">{t("dashboard.timeline")}</h3>
                        <div className="relative border-l border-muted pl-6 ml-3">
                          {application.timeline.map((event: any, index: number) => (
                            <div key={index} className="mb-8 last:mb-0">
                              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></div>
                              <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">
                                {formatDate(event.date)}
                              </time>
                              <h3 className="text-lg font-semibold">{event.status}</h3>
                              <p className="text-base font-normal text-muted-foreground">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
