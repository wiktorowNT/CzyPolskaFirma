"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink, Share2, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ReportForm } from "@/components/report-form"
import {
  calculateIndexBreakdown,
  getScoreColor,
  getScoreBackgroundColor,
  CRITERION_LABELS,
  CRITERION_DESCRIPTIONS,
  type CompanyBreakdown,
} from "@/lib/company-utils"
import categories from "@/data/categories.json"

interface CompanyDetail {
  id: string
  brand: string
  company: string
  categorySlug: string
  score: number
  badges: string[]
  website?: string
  logoUrl?: string
  headquarters?: { country: string; city: string }
  registry?: { krs?: string; nip?: string; regon?: string }
  tax?: { paysCITinPL?: boolean; lastYear?: string }
  production?: { inPL?: "tak" | "częściowo" | "nie"; notes?: string }
  employment?: { inPL?: "tak" | "częściowo" | "brak danych"; headcountPL?: number }
  rnd?: { inPL?: boolean; notes?: string }
  brandOrigin?: { fromPL?: boolean; notes?: string }
  ownership?: {
    companyTree?: Array<{ label: string; value: string }>
    beneficialOwners?: Array<{ name: string; country?: string; share?: string }>
  }
  breakdown?: CompanyBreakdown
  history?: Array<{ date: string; title: string; text?: string }>
  sources?: Array<{ label: string; url: string }>
  lastVerified?: string
}

function getCategoryName(slug: string): string {
  const category = categories[slug as keyof typeof categories]
  return category?.name || slug
}

function getPolishAlternatives(categorySlug: string, currentId: string) {
  const category = categories[categorySlug as keyof typeof categories]
  if (!category) return []

  return category.items
    .filter((item: any) => item.id !== currentId && item.score >= 70)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 6)
}

function ShareButton({ url, brand }: { url: string; brand: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Skopiowano!" : "Udostępnij"}
    </Button>
  )
}

export default function CompanyProfileClient({ params, company }: { params: { id: string }; company: CompanyDetail }) {
  const categoryName = getCategoryName(company.categorySlug)
  const polishAlternatives = getPolishAlternatives(company.categorySlug, company.id)

  const currentUrl =
    typeof window !== "undefined" ? `${window.location.origin}/firma/${company.id}` : `/firma/${company.id}`

  const breakdown = company.breakdown || calculateIndexBreakdown(company.score, company.badges)

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Strona główna
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/#kategorie" className="hover:text-slate-900">
                Kategorie
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/kategoria/${company.categorySlug}`} className="hover:text-slate-900">
                {categoryName}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-900 font-medium">{company.brand}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Company Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={company.logoUrl || "/placeholder.svg?height=80&width=80"}
                    alt={`Logo ${company.brand}`}
                    className="w-20 h-20 rounded-lg object-contain bg-slate-50"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.brand}</h1>
                  <p className="text-lg text-slate-600 mb-4">{company.company}</p>
                  <div className="flex flex-wrap gap-2">
                    {company.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className={`text-center p-6 rounded-lg ${getScoreBackgroundColor(company.score)}`}>
                  <div className={`text-4xl font-bold ${getScoreColor(company.score)}`}>{company.score}/100</div>
                  <div className="text-sm text-slate-600 mt-1">Indeks polskości</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ReportForm />
                  <ShareButton url={currentUrl} brand={company.brand} />
                  {company.website && (
                    <Button variant="outline" asChild>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Strona firmy
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Wartości demonstracyjne — nie są danymi rzeczywistymi.</span>
              </div>
            </div>
          </div>

          {/* Report Error Button */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Masz informacje o tej firmie?</h3>
                <p className="text-slate-600">Pomóż nam obliczyć dokładny indeks polskości</p>
              </div>
              <ReportForm companyName={company.brand}>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <AlertTriangle className="w-4 w-4" />
                  Zgłoś indeks polskości
                </Button>
              </ReportForm>
            </div>
          </div>

          {/* Index Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Rozbicie Indeksu polskości</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(breakdown).map(([key, value]) => {
                const maxValue =
                  key === "capital"
                    ? 40
                    : key === "hq" || key === "taxes"
                      ? 15
                      : key === "production" || key === "employment"
                        ? 10
                        : 5
                const percentage = (value / maxValue) * 100

                return (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {CRITERION_LABELS[key as keyof typeof CRITERION_LABELS]}
                      </h3>
                      <span className="text-lg font-bold text-slate-900">
                        {value}/{maxValue}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className="mb-2"
                      aria-label={`Indeks polskości — ${CRITERION_LABELS[key as keyof typeof CRITERION_LABELS]}: ${value} na ${maxValue}`}
                    />
                    <p className="text-sm text-slate-600">
                      {CRITERION_DESCRIPTIONS[key as keyof typeof CRITERION_DESCRIPTIONS]}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 text-sm text-slate-600">
              Ostatnia weryfikacja: {company.lastVerified} |
              <Link href="/#metodologia" className="text-red-600 hover:text-red-700 ml-1">
                Metodologia
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ownership */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Właścicielstwo i kapitał</h2>
              {company.ownership?.companyTree ? (
                <div className="space-y-3 mb-4">
                  {company.ownership.companyTree.map((level, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium text-slate-700">{level.label}:</span>
                      <span className="text-slate-900">{level.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic mb-4">Dane w przygotowaniu</p>
              )}

              {company.ownership?.beneficialOwners && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Beneficjenci rzeczywiści:</h3>
                  <div className="space-y-2">
                    {company.ownership.beneficialOwners.map((owner, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-slate-900">{owner.name}</span>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">{owner.country}</div>
                          {owner.share && <div className="font-medium">{owner.share}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Headquarters and Taxes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Siedziba i podatki</h2>
              <div className="space-y-3">
                {company.headquarters ? (
                  <div>
                    <span className="font-medium text-slate-700">Siedziba główna:</span>
                    <span className="ml-2 text-slate-900">
                      {company.headquarters.city}, {company.headquarters.country}
                    </span>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Dane w przygotowaniu</p>
                )}

                {company.tax && (
                  <div>
                    <span className="font-medium text-slate-700">CIT w Polsce:</span>
                    <span className="ml-2 text-slate-900">
                      {company.tax.paysCITinPL ? "Tak" : "Nie"}
                      {company.tax.lastYear && ` (${company.tax.lastYear})`}
                    </span>
                  </div>
                )}

                {company.registry && (
                  <div className="space-y-1">
                    <div className="font-medium text-slate-700">Rejestry:</div>
                    {company.registry.krs && <div className="text-sm">KRS: {company.registry.krs}</div>}
                    {company.registry.nip && <div className="text-sm">NIP: {company.registry.nip}</div>}
                    {company.registry.regon && <div className="text-sm">REGON: {company.registry.regon}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Production */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Produkcja i łańcuch dostaw</h2>
              {company.production ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Produkcja w Polsce:</span>
                    <span className="ml-2 text-slate-900 capitalize">{company.production.inPL}</span>
                  </div>
                  {company.production.notes && <p className="text-slate-600 text-sm">{company.production.notes}</p>}
                </div>
              ) : (
                <p className="text-slate-500 italic">Dane w przygotowaniu</p>
              )}
            </div>

            {/* Employment and R&D */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Zatrudnienie i R&D</h2>
              <div className="space-y-3">
                {company.employment ? (
                  <div>
                    <span className="font-medium text-slate-700">Zatrudnienie w Polsce:</span>
                    <span className="ml-2 text-slate-900 capitalize">{company.employment.inPL}</span>
                    {company.employment.headcountPL && (
                      <span className="ml-2 text-slate-600">
                        ({company.employment.headcountPL.toLocaleString()} osób)
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Dane w przygotowaniu</p>
                )}

                {company.rnd ? (
                  <div>
                    <span className="font-medium text-slate-700">R&D w Polsce:</span>
                    <span className="ml-2 text-slate-900">{company.rnd.inPL ? "Tak" : "Nie"}</span>
                    {company.rnd.notes && <p className="text-slate-600 text-sm mt-1">{company.rnd.notes}</p>}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Dane w przygotowaniu</p>
                )}
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Krótka historia</h2>
            {company.history && company.history.length > 0 ? (
              <div className="space-y-6">
                {company.history.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-sm font-semibold text-red-600">{event.date}</span>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-red-600 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
                      {event.text && <p className="text-slate-600 text-sm">{event.text}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">Dane w przygotowaniu</p>
            )}
          </div>

          {/* Sources */}
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Źródła</h2>
            {company.sources && company.sources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900 hover:text-red-600">{source.label}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">Dane w przygotowaniu</p>
            )}
          </div>

          {/* Polish Alternatives */}
          {polishAlternatives.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Polskie alternatywy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {polishAlternatives.map((alternative: any) => (
                  <Link
                    key={alternative.id}
                    href={`/firma/${alternative.id}`}
                    className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{alternative.brand}</h3>
                      <span className={`text-sm font-bold ${getScoreColor(alternative.score)}`}>
                        {alternative.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{alternative.company}</p>
                    <div className="flex flex-wrap gap-1">
                      {alternative.badges.slice(0, 2).map((badge: string) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge.replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {alternative.badges.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{alternative.badges.length - 2}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}