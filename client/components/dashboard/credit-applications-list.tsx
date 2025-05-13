"use client"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CreditApplicationsListProps {
  applications: any[]
  isLoading: boolean
  showDetailedView?: boolean
}

export default function CreditApplicationsList({
  applications,
  isLoading,
  showDetailedView = false,
}: CreditApplicationsListProps) {
  const { t } = useTranslation()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("dashboard.noApplicationsFound")}</h3>
          <p className="text-muted-foreground mb-6">{t("dashboard.noApplicationsDescription")}</p>
          <Button asChild>
            <Link href="/credit">
              <CreditCard className="mr-2 h-4 w-4" />
              {t("dashboard.applyNow")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{getCreditTypeName(application.creditType)}</CardTitle>
                <CardDescription>
                  {t("dashboard.applicationId")}: {application.id} • {t("dashboard.submittedOn")}:{" "}
                  {formatDate(application.createdAt)}
                </CardDescription>
              </div>
              <div>{getStatusBadge(application.status)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {application.status === "approuvé" && (
                <Badge variant="outline" className="text-green-600 dark:text-green-400">
                  {t("dashboard.approved")}
                </Badge>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" onClick={() => setSelectedApplication(application)}>
                  <Info className="mr-2 h-4 w-4" />
                  {t("dashboard.viewDetails")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("dashboard.applicationDetails")}</DialogTitle>
                  <DialogDescription>
                    {t("dashboard.applicationId")}: {application.id} • {t("dashboard.submittedOn")}:{" "}
                    {formatDate(application.createdAt)}
                  </DialogDescription>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
