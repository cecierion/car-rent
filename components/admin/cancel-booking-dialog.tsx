"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Booking, Car } from "@/lib/types"

interface CancelBookingDialogProps {
  booking: Booking | null
  cars: Car[]
  isOpen: boolean
  onClose: () => void
  onCancel: (bookingId: string, reason: string) => void
}

export function CancelBookingDialog({ booking, cars, isOpen, onClose, onCancel }: CancelBookingDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!booking) return

    setIsLoading(true)
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onCancel(booking.id, reason)
    } finally {
      setIsLoading(false)
      setReason("")
      onClose()
    }
  }

  if (!booking) return null

  const car = cars.find((c) => c.id === booking.carId)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? This action will mark the booking as cancelled and make the
            car available for other customers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-4">
          <div className="rounded-md border p-3">
            <h4 className="font-medium">Booking Details</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Customer:</span> {booking.name}
              </div>
              <div>
                <span className="font-medium">Car:</span> {car ? `${car.make} ${car.model}` : "Unknown"}
              </div>
              <div>
                <span className="font-medium">From:</span>{" "}
                {new Date(booking.startDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </div>
              <div>
                <span className="font-medium">To:</span>{" "}
                {new Date(booking.endDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Cancelling..." : "Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
