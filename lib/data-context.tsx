"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { carsData, bookingsData } from "@/lib/data"
import type { Car, Booking } from "@/lib/types"

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface DataContextType {
  cars: Car[]
  setCars: (cars: Car[]) => void
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
  locations: Location[]
  setLocations: (locations: Location[]) => void
  addCar: (car: Car) => void
  updateCar: (car: Car) => void
  deleteCar: (id: string) => void
  addBooking: (booking: Booking) => void
  updateBooking: (booking: Booking) => void
  deleteBooking: (id: string) => void
  addLocation: (location: Location) => void
  updateLocation: (location: Location) => void
  deleteLocation: (id: string) => void
}

// Initial locations data
const locationsData: Location[] = [
  {
    id: "loc1",
    name: "Downtown Branch",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  {
    id: "loc2",
    name: "Airport Terminal",
    address: "456 Airport Road",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90045",
    country: "USA",
  },
  {
    id: "loc3",
    name: "Central Station",
    address: "789 Railway Avenue",
    city: "Chicago",
    state: "IL",
    zipCode: "60606",
    country: "USA",
  },
]

// Update cars with location IDs
const carsWithLocations = carsData.map((car, index) => ({
  ...car,
  locationId: locationsData[index % locationsData.length].id,
}))

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(carsWithLocations)
  const [bookings, setBookings] = useState<Booking[]>(bookingsData)
  const [locations, setLocations] = useState<Location[]>(locationsData)

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCars = localStorage.getItem("car_rental_cars")
      const storedBookings = localStorage.getItem("car_rental_bookings")
      const storedLocations = localStorage.getItem("car_rental_locations")

      if (storedCars) setCars(JSON.parse(storedCars))
      if (storedBookings) setBookings(JSON.parse(storedBookings))
      if (storedLocations) setLocations(JSON.parse(storedLocations))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("car_rental_cars", JSON.stringify(cars))
      localStorage.setItem("car_rental_bookings", JSON.stringify(bookings))
      localStorage.setItem("car_rental_locations", JSON.stringify(locations))
    }
  }, [cars, bookings, locations])

  const addCar = (car: Car) => {
    setCars((prevCars) => [...prevCars, car])
  }

  const updateCar = (car: Car) => {
    setCars((prevCars) => prevCars.map((c) => (c.id === car.id ? car : c)))
  }

  const deleteCar = (id: string) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== id))
  }

  const addBooking = (booking: Booking) => {
    setBookings((prevBookings) => [...prevBookings, booking])
  }

  const updateBooking = (booking: Booking) => {
    setBookings((prevBookings) => prevBookings.map((b) => (b.id === booking.id ? booking : b)))
  }

  const deleteBooking = (id: string) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id))
  }

  const addLocation = (location: Location) => {
    setLocations((prevLocations) => [...prevLocations, location])
  }

  const updateLocation = (location: Location) => {
    setLocations((prevLocations) => prevLocations.map((l) => (l.id === location.id ? location : l)))
  }

  const deleteLocation = (id: string) => {
    // Check if any cars are using this location
    const carsUsingLocation = cars.some((car) => car.locationId === id)

    if (carsUsingLocation) {
      alert("Cannot delete location because it is being used by one or more cars")
      return
    }

    setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        cars,
        setCars,
        bookings,
        setBookings,
        locations,
        setLocations,
        addCar,
        updateCar,
        deleteCar,
        addBooking,
        updateBooking,
        deleteBooking,
        addLocation,
        updateLocation,
        deleteLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
