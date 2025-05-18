"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  FileText,
  Search,
  MessageSquare,
  Mail,
  Eye,
  Download,
  Send,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminProtectedRoute from "@/components/admin/admin-protected-route"

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [creditApplications, setCreditApplications] = useState<any[]>([])
  const [reclamations, setReclamations] = useState<any[]>([])
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)
  const [isLoadingReclamations, setIsLoadingReclamations] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reclamationSearchTerm, setReclamationSearchTerm] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false)
  const [currentApplication, setCurrentApplication] = useState<any>(null)

  // Statistiques
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalReclamations: 0,
  })

  const fetchAllCreditApplications = async (token: string) => {
    try {
      setIsLoadingCredits(true)

      // Appel à l'API pour récupérer toutes les demandes de crédit
      const response = await axios.get("http://localhost:5000/api/req/credits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && Array.isArray(response.data)) {
        setCreditApplications(response.data)

        // Calculer les statistiques
        const total = response.data.length
        const pending = response.data.filter((app) => app.status === "en attente").length
        const approved = response.data.filter((app) => app.status === "approuvé").length
        const rejected = response.data.filter((app) => app.status === "rejeté").length

        setStats((prev) => ({
          ...prev,
          totalApplications: total,
          pendingApplications: pending,
          approvedApplications: approved,
          rejectedApplications: rejected,
        }))
      } else {
        setCreditApplications([])
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des demandes de crédit:", error.message)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les demandes de crédit",
        variant: "destructive",
      })
      setCreditApplications([])
    } finally {
      setIsLoadingCredits(false)
    }
  }

  const fetchAllReclamations = async (token: string) => {
    try {
      setIsLoadingReclamations(true)

      // Appel à l'API pour récupérer toutes les réclamations
      const response = await axios.get("http://localhost:5000/api/rec/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && Array.isArray(response.data)) {
        setReclamations(response.data)
        setStats((prev) => ({
          ...prev,
          totalReclamations: response.data.length,
        }))
      } else {
        setReclamations([])
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des réclamations:", error.message)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les réclamations",
        variant: "destructive",
      })
      setReclamations([])
    } finally {
      setIsLoadingReclamations(false)
    }
  }

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est un administrateur
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Vérifier si l'utilisateur est un administrateur
      if (parsedUser.admin !== 1) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à cette page",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      // Récupérer toutes les demandes de crédit et les réclamations
      fetchAllCreditApplications(token)
      fetchAllReclamations(token)
    } catch (error) {
      console.error("Erreur lors de l'analyse des données utilisateur:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
    }
  }, [router])

  const handleUpdateStatus = async (applicationId: string, newStatus: string, rejectionReason?: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        })
        return
      }

      const payload: any = { status: newStatus }
      if (newStatus === "rejeté" && rejectionReason) {
        payload.rejectionReason = rejectionReason
      }

      await axios.put(`http://localhost:5000/api/req/credits/${applicationId}/status`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: "Succès",
        description: `Le statut de la demande a été mis à jour avec succès`,
      })

      // Si la demande est approuvée, envoyer un email avec le PDF
      if (newStatus === "approuvé") {
        const application = creditApplications.find((app) => app._id === applicationId)
        if (application) {
          setCurrentApplication(application)
          handleSendApprovalEmail(application)
        }
      }

      // Rafraîchir les données
      fetchAllCreditApplications(token)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la demande",
        variant: "destructive",
      })
    }
  }

  const handleSendApprovalEmail = async (application: any) => {
    try {
      setIsSendingEmail(true)
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        })
        return
      }

      // Appel à l'API pour envoyer l'email avec le PDF
      await axios.post(
        `http://localhost:5000/api/email/send-approval-email`,
        {
          recipientEmail: application.personalInfo?.email,
          recipientName: `${application.personalInfo?.firstName} ${application.personalInfo?.lastName}`,
          creditType: application.creditType,
          creditAmount: application.creditAmount,
          duration: application.duration,
          monthlyPayment: application.monthlyPayment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Afficher la boîte de dialogue de confirmation
      setShowEmailSentDialog(true)

      toast({
        title: "Email envoyé",
        description: "L'email avec le contrat a été envoyé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email avec le contrat",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleReplyToReclamation = async (reclamationId: string, response: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        })
        return
      }

      await axios.put(
        `http://localhost:5000/api/rec/${reclamationId}/reply`,
        { response, status: "répondu" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      toast({
        title: "Succès",
        description: "Votre réponse a été envoyée avec succès",
      })

      // Rafraîchir les données
      fetchAllReclamations(token)
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre réponse",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    })

    router.push("/")
  }

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
            Approuvé
          </Badge>
        )
      case "rejeté":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Rejeté
          </Badge>
        )
      case "en attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" />
            En attente
          </Badge>
        )
      case "répondu":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Répondu
          </Badge>
        )
      case "non répondu":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" />
            Non répondu
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderDocumentViewer = (documents: any) => {
    if (!documents) {
      return (
        <div className="text-center py-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p>Aucun document disponible</p>
        </div>
      )
    }

    const documentLabels: Record<string, string> = {
      cinRecto: "CIN (Recto)",
      cinVerso: "CIN (Verso)",
      bankStatements: "Relevés bancaires",
      taxDeclaration: "Déclaration fiscale",
      incomeProof: "Justificatif de revenus",
      businessRegistry: "Registre de commerce",
      residenceProof: "Justificatif de domicile",
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(documents).map(([key, url]) => {
          if (!url) return null

          const label = documentLabels[key] || key
          const docUrl = url as string

          return (
            <div key={key} className="flex flex-col border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{label}</span>
                <div className="flex gap-2">
                  <DocumentPreviewDialog url={docUrl} label={label} />
                  <a
                    href={docUrl}
                    download
                    className="inline-flex items-center text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Télécharger
                  </a>
                </div>
              </div>
              {docUrl && docUrl.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/) ? (
                <div className="relative h-36 w-full overflow-hidden rounded border bg-muted">
                  <img src={docUrl || "/placeholder.svg"} alt={label} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-36 w-full bg-muted/50 rounded border">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const DocumentPreviewDialog = ({ url, label }: { url: string; label: string }) => {
    // Check if it's an image or another file type
    const isImage = url.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/)

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>Prévisualiser</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Ouvrir dans un nouvel onglet
              </a>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-center justify-center">
            {isImage ? (
              <div className="max-h-[70vh] overflow-auto">
                <img src={url || "/placeholder.svg"} alt={label} className="mx-auto max-w-full object-contain" />
              </div>
            ) : url.toLowerCase().endsWith(".pdf") ? (
              <iframe src={`${url}#view=FitH`} className="w-full h-[70vh]" title={label}></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-lg">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center">
                  Ce type de document ne peut pas être prévisualisé. Veuillez le télécharger pour le consulter.
                </p>
                <Button className="mt-4" asChild>
                  <a href={url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  // Filtrer les demandes de crédit
  const filteredApplications = creditApplications.filter((app) => {
    // Filtre par statut
    if (statusFilter !== "all" && app.status !== statusFilter) {
      return false
    }

    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        app.id?.toString().includes(searchLower) ||
        app.creditType?.toLowerCase().includes(searchLower) ||
        app.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
        app.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
        app.personalInfo?.cin?.toLowerCase().includes(searchLower) ||
        app.personalInfo?.email?.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Filtrer les réclamations
  const filteredReclamations = reclamations.filter((rec) => {
    if (reclamationSearchTerm) {
      const searchLower = reclamationSearchTerm.toLowerCase()
      return (
        rec.id?.toString().includes(searchLower) ||
        rec.name?.toLowerCase().includes(searchLower) ||
        rec.email?.toLowerCase().includes(searchLower) ||
        rec.message?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <AdminProtectedRoute>
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
              {user && <p className="text-muted-foreground">Bienvenue, {user.email || user.CIN} (Administrateur)</p>}
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total des demandes</p>
                  <p className="text-3xl font-bold">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-80" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvées</p>
                  <p className="text-3xl font-bold">{stats.approvedApplications}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejetées</p>
                  <p className="text-3xl font-bold">{stats.rejectedApplications}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500 opacity-80" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réclamations</p>
                  <p className="text-3xl font-bold">{stats.totalReclamations}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500 opacity-80" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="credits" className="space-y-4">
            <TabsList className="mb-4">
              <TabsTrigger value="credits">Demandes de crédit</TabsTrigger>
              <TabsTrigger value="reclamations">Réclamations</TabsTrigger>
            </TabsList>

            <TabsContent value="credits">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Gestion des demandes de crédit</CardTitle>
                  <CardDescription>Consultez et gérez toutes les demandes de crédit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par ID, nom, CIN..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="en attente">En attente</SelectItem>
                          <SelectItem value="approuvé">Approuvé</SelectItem>
                          <SelectItem value="rejeté">Rejeté</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Liste des demandes */}
                  {isLoadingCredits ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune demande trouvée</h3>
                      <p className="text-muted-foreground">Aucune demande ne correspond à vos critères de recherche</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApplications.map((application) => (
                        <Card key={application.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{getCreditTypeName(application.creditType)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ID: {application.id} • Soumise le: {formatDate(application.createdAt)}
                                </p>
                                {application.personalInfo && (
                                  <p className="text-sm font-medium mt-1">
                                    {application.personalInfo.firstName} {application.personalInfo.lastName}
                                    {application.personalInfo.cin && ` (CIN: ${application.personalInfo.cin})`}
                                  </p>
                                )}
                              </div>
                              <div className="mt-2 md:mt-0">{getStatusBadge(application.status)}</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center">
                                <DollarSign className="h-5 w-5 text-primary mr-2" />
                                <span className="font-medium">Montant:</span>
                                <span className="ml-2">{application.creditAmount?.toLocaleString() || 0} DT</span>
                              </div>

                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-primary mr-2" />
                                <span className="font-medium">Durée:</span>
                                <span className="ml-2">{application.duration || 0} mois</span>
                              </div>

                              <div className="flex items-center">
                                <DollarSign className="h-5 w-5 text-primary mr-2" />
                                <span className="font-medium">Mensualité:</span>
                                <span className="ml-2">{application.monthlyPayment?.toFixed(2) || 0} DT/mois</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline">
                                    <Info className="mr-2 h-4 w-4" />
                                    Détails
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Détails de la demande</DialogTitle>
                                  </DialogHeader>

                                  <div className="mt-4 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div className="flex items-center">
                                          <CreditCard className="h-5 w-5 text-primary mr-2" />
                                          <span className="font-medium">Type de crédit:</span>
                                          <span className="ml-2">{getCreditTypeName(application.creditType)}</span>
                                        </div>

                                        <div className="flex items-center">
                                          <DollarSign className="h-5 w-5 text-primary mr-2" />
                                          <span className="font-medium">Montant:</span>
                                          <span className="ml-2">
                                            {application.creditAmount?.toLocaleString() || 0} DT
                                          </span>
                                        </div>

                                        <div className="flex items-center">
                                          <Calendar className="h-5 w-5 text-primary mr-2" />
                                          <span className="font-medium">Durée:</span>
                                          <span className="ml-2">{application.duration || 0} mois</span>
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="flex items-center">
                                          <Clock className="h-5 w-5 text-primary mr-2" />
                                          <span className="font-medium">Statut:</span>
                                          <span className="ml-2">{getStatusBadge(application.status)}</span>
                                        </div>

                                        <div className="flex items-center">
                                          <DollarSign className="h-5 w-5 text-primary mr-2" />
                                          <span className="font-medium">Mensualité:</span>
                                          <span className="ml-2">
                                            {application.monthlyPayment?.toFixed(2) || 0} DT/mois
                                          </span>
                                        </div>

                                        {application.status === "rejeté" && application.rejectionReason && (
                                          <div className="flex items-start">
                                            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                            <div>
                                              <span className="font-medium">Motif de rejet:</span>
                                              <p className="text-muted-foreground">{application.rejectionReason}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {application.personalInfo && (
                                      <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
                                          {application.personalInfo.lastName && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Nom</p>
                                              <p className="font-medium">{application.personalInfo.lastName}</p>
                                            </div>
                                          )}
                                          {application.personalInfo.firstName && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Prénom</p>
                                              <p className="font-medium">{application.personalInfo.firstName}</p>
                                            </div>
                                          )}
                                          {application.personalInfo.cin && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">CIN</p>
                                              <p className="font-medium">{application.personalInfo.cin}</p>
                                            </div>
                                          )}
                                          {application.personalInfo.phone && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Téléphone</p>
                                              <p className="font-medium">{application.personalInfo.phone}</p>
                                            </div>
                                          )}
                                          {application.personalInfo.email && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Email</p>
                                              <p className="font-medium">{application.personalInfo.email}</p>
                                            </div>
                                          )}
                                          {application.personalInfo.address && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Adresse</p>
                                              <p className="font-medium">{application.personalInfo.address}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {application.professionalInfo && (
                                      <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Informations professionnelles</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
                                          {application.professionalInfo.profession && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Profession</p>
                                              <p className="font-medium">{application.professionalInfo.profession}</p>
                                            </div>
                                          )}
                                          {application.professionalInfo.company && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Entreprise</p>
                                              <p className="font-medium">{application.professionalInfo.company}</p>
                                            </div>
                                          )}
                                          {application.professionalInfo.contractType && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Type de contrat</p>
                                              <p className="font-medium">{application.professionalInfo.contractType}</p>
                                            </div>
                                          )}
                                          {application.professionalInfo.seniority && (
                                            <div>
                                              <p className="text-sm text-muted-foreground">Ancienneté</p>
                                              <p className="font-medium">
                                                {application.professionalInfo.seniority} ans
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {application.documents && (
                                    <div className="mt-6">
                                      <h3 className="text-lg font-semibold mb-3">Documents</h3>
                                      {renderDocumentViewer(application.documents)}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {application.status === "en attente" && (
                                <>
                                  <Button
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(application._id, "approuvé")}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approuver
                                  </Button>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="destructive">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Rejeter
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Rejeter la demande</DialogTitle>
                                      </DialogHeader>
                                      <div className="py-4">
                                        <label className="block text-sm font-medium mb-2">Motif du rejet</label>
                                        <textarea
                                          className="w-full p-2 border rounded-md min-h-[100px]"
                                          placeholder="Veuillez indiquer le motif du rejet..."
                                          id="rejectionReason"
                                        ></textarea>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <DialogTrigger asChild>
                                          <Button variant="outline">Annuler</Button>
                                        </DialogTrigger>
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            const reason = (
                                              document.getElementById("rejectionReason") as HTMLTextAreaElement
                                            ).value
                                            handleUpdateStatus(application._id, "rejeté", reason)
                                          }}
                                        >
                                          Confirmer le rejet
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}

                              {application.status === "approuvé" && (
                                <Button
                                  variant="outline"
                                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:border-blue-800"
                                  onClick={() => {
                                    setCurrentApplication(application)
                                    handleSendApprovalEmail(application)
                                  }}
                                  disabled={isSendingEmail}
                                >
                                  {isSendingEmail ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Envoi en cours...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="mr-2 h-4 w-4" />
                                      Envoyer le contrat
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reclamations">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Gestion des réclamations</CardTitle>
                  <CardDescription>Consultez et répondez aux réclamations des clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom, email..."
                        className="pl-10"
                        value={reclamationSearchTerm}
                        onChange={(e) => setReclamationSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Liste des réclamations */}
                  {isLoadingReclamations ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredReclamations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune réclamation trouvée</h3>
                      <p className="text-muted-foreground">
                        Aucune réclamation ne correspond à vos critères de recherche
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReclamations.map((reclamation) => (
                        <Card key={reclamation.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{reclamation.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ID: {reclamation.id} • Soumise le:{" "}
                                  {formatDate(reclamation.createdAt || new Date().toISOString())}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0">{getStatusBadge(reclamation.status || "non répondu")}</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center">
                                <Mail className="h-5 w-5 text-primary mr-2" />
                                <span className="font-medium">Email:</span>
                                <span className="ml-2">{reclamation.email}</span>
                              </div>

                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-primary mr-2" />
                                <span className="font-medium">Date:</span>
                                <span className="ml-2">
                                  {formatDate(reclamation.createdAt || new Date().toISOString())}
                                </span>
                              </div>
                            </div>

                            <div className="mb-4 p-4 bg-muted/20 rounded-md">
                              <h4 className="font-medium mb-2">Message:</h4>
                              <p className="text-muted-foreground">{reclamation.message}</p>
                            </div>

                            {reclamation.response && (
                              <div className="mb-4 p-4 bg-green-50 rounded-md dark:bg-green-900/20">
                                <h4 className="font-medium mb-2">Réponse:</h4>
                                <p className="text-muted-foreground">{reclamation.response}</p>
                              </div>
                            )}

                            {(!reclamation.status || reclamation.status === "non répondu") && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="default">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Répondre
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Répondre à la réclamation</DialogTitle>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="mb-4">
                                      <h4 className="font-medium">De:</h4>
                                      <p>{reclamation.name}</p>
                                      <p className="text-sm text-muted-foreground">{reclamation.email}</p>
                                    </div>
                                    <div className="mb-4">
                                      <h4 className="font-medium">Message:</h4>
                                      <p className="text-muted-foreground">{reclamation.message}</p>
                                    </div>
                                    <label className="block text-sm font-medium mb-2">Votre réponse</label>
                                    <textarea
                                      className="w-full p-2 border rounded-md min-h-[150px]"
                                      placeholder="Rédigez votre réponse ici..."
                                      id="reclamationResponse"
                                    ></textarea>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <DialogTrigger asChild>
                                      <Button variant="outline">Annuler</Button>
                                    </DialogTrigger>
                                    <Button
                                      variant="default"
                                      onClick={() => {
                                        const response = (
                                          document.getElementById("reclamationResponse") as HTMLTextAreaElement
                                        ).value
                                        handleReplyToReclamation(reclamation.id, response)
                                      }}
                                    >
                                      Envoyer la réponse
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Boîte de dialogue de confirmation d'envoi d'email */}
        <Dialog open={showEmailSentDialog} onOpenChange={setShowEmailSentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Email envoyé avec succès</DialogTitle>
              <DialogDescription>
                Un email contenant le contrat de crédit a été envoyé à {currentApplication?.personalInfo?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-green-50 p-4 rounded-md dark:bg-green-900/20">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Le client recevra:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Un contrat de crédit au format PDF</li>
                    <li>Des instructions pour la signature électronique</li>
                    <li>Les détails complets de son crédit</li>
                    <li>Les prochaines étapes du processus</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowEmailSentDialog(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </AdminProtectedRoute>
  )
}
