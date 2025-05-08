"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-4 text-2xl font-bold">Processing your booking...</div>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Booking Request Received!</CardTitle>
            <CardDescription>Your booking request has been submitted successfully.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
              <p className="mb-2 font-medium">Booking ID: {params.id}</p>
              <p className="mb-2 text-sm text-gray-600">
                Status: <span className="font-medium text-amber-600">Pending Approval</span>
              </p>
              <p className="text-sm text-gray-600">
                We'll review your booking request and send you a confirmation email once approved.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Thank you for choosing AutoShop Car Rentals. If you have any questions, please contact our customer
              service.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/" passHref>
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
