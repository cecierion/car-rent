"use server"

import { revalidatePath } from "next/cache"
import { notificationsData } from "@/lib/data"
import type { Notification } from "@/lib/types"

interface BookingData {
  carId: string
  name: string
  email: string
  phone: string
  startDate: string
  endDate: string
  totalPrice: number
  locationId: string
}

export async function bookCar(data: BookingData) {
  try {
    // In a real application, you would:
    // 1. Save the booking to your database
    // 2. Update the car availability
    // 3. Send a confirmation email

    // Simulate a delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a new booking notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "new_booking",
      title: "New Booking",
      message: `${data.name} has booked a car for ${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    // In a real app, you would save this notification to the database
    // For now, we'll just add it to our in-memory array
    notificationsData.unshift(newNotification)

    // Send confirmation email
    await sendConfirmationEmail({
      to: data.email,
      name: data.name,
      carId: data.carId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: data.totalPrice,
      locationId: data.locationId,
    })

    // Revalidate the cars page to reflect the updated availability
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")
    revalidatePath("/admin/customers")

    return {
      success: true,
      bookingId: `booking-${Date.now()}`,
      status: "pending", // New bookings start as pending
    }
  } catch (error) {
    console.error("Error booking car:", error)
    throw new Error("Failed to book car")
  }
}

interface EmailData {
  to: string
  name: string
  carId: string
  startDate: string
  endDate: string
  totalPrice: number
  locationId: string
}

async function sendConfirmationEmail(data: EmailData) {
  try {
    // In a real application, you would use a service like Resend, SendGrid, or Nodemailer
    // This is a placeholder for the email sending functionality

    console.log("Sending confirmation email to:", data.to)
    console.log("Email data:", data)

    // Email template
    const emailContent = `
      Dear ${data.name},

      Thank you for booking with AutoShop Car Rentals!

      Your booking is currently pending approval by our team. You will receive another email once your booking is confirmed.

      Booking Details:
      - Pickup Date: ${new Date(data.startDate).toLocaleDateString()}
      - Return Date: ${new Date(data.endDate).toLocaleDateString()}
      - Total Price: $${data.totalPrice}

      If you have any questions, please contact our customer service.

      Best regards,
      The AutoShop Team
    `

    console.log("Email content:", emailContent)

    // Simulate a delay for the email sending
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    // We don't want to fail the booking if the email fails
    // Just log the error and continue
    return { success: false, error }
  }
}

export async function approveBooking(bookingId: string) {
  try {
    // In a real app, you would update the booking status in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "booking_update",
      title: "Booking Approved",
      message: `Booking #${bookingId} has been approved`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    return { success: true }
  } catch (error) {
    console.error("Error approving booking:", error)
    throw new Error("Failed to approve booking")
  }
}

export async function rejectBooking(bookingId: string, reason: string) {
  try {
    // In a real app, you would update the booking status in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "booking_update",
      title: "Booking Rejected",
      message: `Booking #${bookingId} has been rejected: ${reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "high",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    return { success: true }
  } catch (error) {
    console.error("Error rejecting booking:", error)
    throw new Error("Failed to reject booking")
  }
}
