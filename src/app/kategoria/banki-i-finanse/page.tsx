import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import CategoryList from "@/components/category-list"
import ScrollToTop from "@/components/scroll-to-top"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "Banki i finanse - Czy Polska Firma",
  description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  openGraph: {
    title: "Banki i finanse - Czy Polska Firma",
    description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  },
}

export default function BankiFinansePage() {
  const category = categoriesData["banki-i-finanse"]

  if (!category) {
    return <div>Kategoria nie została znaleziona</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <div className="container mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Strona główna
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <span className="text-slate-400">Kategorie</span>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <span className="text-slate-900 font-medium">Banki i finanse</span>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
          <p className="text-lg text-slate-600">{category.short}</p>
        </div>

        <CategoryList items={category.items} />

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">Wartości demonstracyjne — nie są danymi rzeczywistymi.</p>
        </div>
      </div>
    </div>
  )
}
