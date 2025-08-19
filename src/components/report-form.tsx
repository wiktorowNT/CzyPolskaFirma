"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, CheckCircle, Upload } from "lucide-react"

interface ReportFormProps {
  companyName?: string
  children?: React.ReactNode
}

export function ReportForm({ companyName, children }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    brandName: "",
    sourceLink: "",
    comment: "",
    email: "",
    attachment: null as File | null,
  })

  // Set initial brand name if provided
  React.useEffect(() => {
    if (companyName && !formData.brandName) {
      setFormData(prev => ({ ...prev, brandName: companyName }))
    }
  }, [companyName, formData.brandName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Plik jest za duży. Maksymalny rozmiar to 10MB.")
        return
      }
      setFormData({ ...formData, attachment: file })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo submission - no backend
    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setFormData({ brandName: companyName || "", sourceLink: "", comment: "", email: "", attachment: null })
    }, 2000)
  }

  const isCompanyProfile = !!companyName

  function renderFormContent() {
    return (
      <>
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {isCompanyProfile ? "Dziękujemy za zgłoszenie indeksu!" : "Dziękujemy za zgłoszenie!"}
                </h3>
                <p className="text-slate-600">
                  {isCompanyProfile 
                    ? "Sprawdzimy podane informacje i zaktualizujemy indeks polskości." 
                    : "Sprawdzimy podane informacje i dodamy je do bazy."
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName" className="text-sm font-medium text-slate-700">
                    {isCompanyProfile ? "Nazwa firmy *" : "Nazwa marki *"}
                  </Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder={isCompanyProfile ? companyName : "np. Przykładowa Marka"}
                    className="w-full"
                    disabled={isCompanyProfile}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceLink" className="text-sm font-medium text-slate-700">
                    {isCompanyProfile ? "Link do źródła informacji o firmie *" : "Link do źródła *"}
                  </Label>
                  <Input
                    id="sourceLink"
                    type="url"
                    value={formData.sourceLink}
                    onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
                    placeholder={isCompanyProfile ? "https://... (KRS, strona firmy, raport roczny)" : "https://..."}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment" className="text-sm font-medium text-slate-700">
                    Załącznik (opcjonalnie)
                  </Label>
                  <div className="relative">
                    <Input
                      id="attachment"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.csv,.xlsx,.xls"
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Obsługiwane formaty: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, CSV, XLS, XLSX. Maksymalny rozmiar: 10MB
                  </p>
                  {formData.attachment && (
                    <p className="text-sm text-green-600">
                      Wybrano: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-medium text-slate-700">
                    {isCompanyProfile ? "Informacje o firmie" : "Komentarz"}
                  </Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder={
                      isCompanyProfile 
                        ? "Opisz strukturę właścicielską, siedzibę, podatki, produkcję, zatrudnienie..." 
                        : "Dodatkowe informacje..."
                    }
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Twój email (opcjonalnie)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="twoj@email.com"
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">
                    {isCompanyProfile 
                      ? "Podaj email, aby otrzymać powiadomienie gdy indeks zostanie zaktualizowany."
                      : "Podaj email, aby otrzymać powiadomienie gdy firma zostanie dodana lub zaktualizowana."
                    }
                  </p>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  {isCompanyProfile ? "Wyślij informacje o firmie" : "Wyślij zgłoszenie"}
                </Button>
              </form>
            )}
      </>
    )
  }

  return (
    <>
      {!isCompanyProfile && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Zgłoś markę lub poprawkę</h2>
            <p className="text-xl text-slate-600 mb-8">Pomóż nam rozwijać bazę. Podaj nazwę i link do źródła.</p>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Zgłoś markę
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Zgłoś markę lub poprawkę</DialogTitle>
                </DialogHeader>
                {renderFormContent()}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      )}

      {isCompanyProfile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {children || (
              <Button variant="outline" className="bg-transparent">
                Zgłoś poprawkę
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Zgłoś indeks polskości dla {companyName}</DialogTitle>
            </DialogHeader>
            {renderFormContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}