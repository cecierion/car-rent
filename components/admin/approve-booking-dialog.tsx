"use client"
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
import { approveBooking } from "@/lib/actions"
import type { Booking, Car } from "@/lib/types"
import { useState } from "react"

interface ApproveBookingDialogProps {
  booking: Booking | null
  cars: Car[]
  isOpen: boolean
  onClose: () => void
  onApprove: (bookingId: string) => void
}

export function ApproveBookingDialog({ booking, cars, isOpen, onClose, onApprove }: ApproveBookingDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!booking) return null

  const car = cars.find((c) => c.id === booking.carId)

  const handleApprove = async () => {
    if (!booking) return

    setIsLoading(true)
    try {
      await approveBooking(booking.id)
      onApprove(booking.id)
      onClose()
    } catch (error) {
      console.error("Error approving booking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this booking? This will confirm the reservation and notify the customer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="rounded-md border p-4">
            <div className="mb-2">
              <span className="font-medium">Customer:</span> {booking.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Car:</span> {car ? `${car.make} ${car.model}` : "Unknown"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Dates:</span> {new Date(booking.startDate).toLocaleDateString()} to{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Total:</span> ${booking.totalPrice}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? "Approving..." : "Approve Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
