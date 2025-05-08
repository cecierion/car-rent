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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { rejectBooking } from "@/lib/actions"
import type { Booking, Car } from "@/lib/types"

interface RejectBookingDialogProps {
  booking: Booking | null
  cars: Car[]
  isOpen: boolean
  onClose: () => void
  onReject: (bookingId: string, reason: string) => void
}

export function RejectBookingDialog({ booking, cars, isOpen, onClose, onReject }: RejectBookingDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!booking) return null

  const car = cars.find((c) => c.id === booking.carId)

  const handleReject = async () => {
    if (!booking || !reason.trim()) return

    setIsLoading(true)
    try {
      await rejectBooking(booking.id, reason)
      onReject(booking.id, reason)
      onClose()
    } catch (error) {
      console.error("Error rejecting booking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting this booking. This information will be sent to the customer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="rounded-md border p-4 mb-4">
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
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for rejection</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={isLoading || !reason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Rejecting..." : "Reject Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
