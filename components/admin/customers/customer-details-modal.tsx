"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Car, CreditCard, MapPin, Phone, Mail, FileText } from "lucide-react"
import type { Customer, Booking, Car as CarType } from "@/lib/types"

interface CustomerDetailsModalProps {
  customer: Customer | null
  bookings: Booking[]
  cars: CarType[]
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsModal({ customer, bookings, cars, isOpen, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null

  // Filter bookings for this customer
  const customerBookings = bookings.filter((booking) => booking.customerId === customer.id)

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "blacklisted":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get booking status badge variant
  const getBookingStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Customer Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(customer.status)} className="capitalize">
                {customer.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.address}
                        <br />
                        {customer.city}, {customer.state} {customer.zipCode}
                        <br />
                        {customer.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Driver License</p>
                      <p className="text-sm text-muted-foreground">{customer.driverLicense || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.dateOfBirth ? format(new Date(customer.dateOfBirth), "MMMM d, yyyy") : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Customer Since</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(customer.joinedDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{customer.totalBookings}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">${customer.totalSpent}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                    <p className="text-2xl font-bold">
                      ${customer.totalBookings > 0 ? Math.round(customer.totalSpent / customer.totalBookings) : 0}
                    </p>
                  </div>
                </div>

                {customer.notes && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{customer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>
                  {customerBookings.length} {customerBookings.length === 1 ? "booking" : "bookings"} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customerBookings.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">No bookings found for this customer</p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Car</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerBookings.map((booking) => {
                          const car = cars.find((c) => c.id === booking.carId)
                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4" />
                                  <span>{car ? `${car.make} ${car.model}` : "Unknown"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                                </div>
                              </TableCell>
                              <TableCell>${booking.totalPrice}</TableCell>
                              <TableCell>
                                <Badge variant={getBookingStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
