"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { bookCar } from "@/lib/actions"
import { useData } from "@/lib/data-context"
import type { Car } from "@/lib/types"
import { addDays, differenceInDays } from "date-fns"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { cars, locations } = useData()
  const [car, setCar] = useState<Car | null>(null)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3))
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")

  useEffect(() => {
    const foundCar = cars.find((c) => c.id === params.id)
    if (foundCar) {
      setCar(foundCar)
      calculatePrice(foundCar.pricePerDay)
      // Set default location to car's location if available
      if (foundCar.locationId) {
        setSelectedLocationId(foundCar.locationId)
      } else if (locations.length > 0) {
        setSelectedLocationId(locations[0].id)
      }
    } else {
      router.push("/")
    }
  }, [params.id, router, cars, locations])

  useEffect(() => {
    if (car) {
      calculatePrice(car.pricePerDay)
    }
  }, [startDate, endDate, car])

  const calculatePrice = (pricePerDay: number) => {
    const days = differenceInDays(endDate, startDate) || 1
    setTotalPrice(days * pricePerDay)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!car) return

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const bookingData = {
      carId: car.id,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
      locationId: selectedLocationId,
    }

    try {
      const result = await bookCar(bookingData)
      if (result.success) {
        router.push(`/confirmation/${result.bookingId}`)
      }
    } catch (error) {
      console.error("Booking failed:", error)
      setLoading(false)
    }
  }

  // Check if the image is a data URL (from our file upload)
  const isDataUrl = car?.image?.startsWith("data:image/")

  if (!car) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto p-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto p-4 py-12 md:p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">Book Your Car</h1>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Car Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {car.image && (
                    <div className="rounded-md overflow-hidden h-40">
                      {isDataUrl ? (
                        <img
                          src={car.image || "/placeholder.svg"}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${car.image})` }}
                        />
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-xl font-bold">
                      {car.make} {car.model}
                    </p>
                    <p>
                      {car.year} • {car.transmission} • {car.fuelType}
                    </p>
                    <p className="text-lg font-semibold">${car.pricePerDay} per day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Period</CardTitle>
                <CardDescription>Select your pickup and return dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location</Label>
                  <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Pickup Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} minDate={new Date()} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Return Date</Label>
                  <DatePicker date={endDate} setDate={setEndDate} minDate={addDays(startDate, 1)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Please provide your contact details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full rounded-lg bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold">${totalPrice}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">For {differenceInDays(endDate, startDate) || 1} days</div>
                </div>
                <Button type="submit" className="w-full" disabled={loading || !selectedLocationId}>
                  {loading ? "Processing..." : "Request Booking"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Your booking will be reviewed by our team before confirmation.
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
