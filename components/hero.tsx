import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CarSearchForm } from "@/components/car-search-form"
import type { Location } from "@/lib/data-context"

interface HeroProps {
  onSearch?: (location: string, pickupDate: Date, returnDate: Date) => void
  locations: Location[]
}

export function Hero({ onSearch, locations }: HeroProps) {
  return (
    <div className="relative bg-white py-24 text-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      />
      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">Premium Car Rental</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Rent your dream car today with our easy booking process and competitive rates.
          </p>
        </div>

        <CarSearchForm onSearch={onSearch} locations={locations} />

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="outline" className="font-semibold hover:bg-primary/10">
            <Link href="#cars">Browse All Cars</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
