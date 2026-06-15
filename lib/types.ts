export type CraftsmanTier = 'basic' | 'skilled' | 'pro' | 'master'
export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled'
export type PaymentMethod = 'fawry' | 'instapay' | 'card' | 'cash'
export type EmergencyType = 'water-leak' | 'power-cut' | 'door-break' | 'fire' | 'gas' | 'other'
export type JobStatus = 'confirmed' | 'en-route' | 'arrived' | 'in-progress' | 'completed'

export interface Craftsman {
  id: string
  name: string
  nameAr: string
  specialty: string
  specialtyAr: string
  avatar: string
  coverPhoto: string
  rating: number
  reviewCount: number
  distance: number // km
  isAvailable: boolean
  tier: CraftsmanTier
  verified: boolean
  yearsExperience: number
  serviceAreas: string[]
  portfolio: string[]
  bio: string
  bioAr: string
  hourlyRate: number
  ratings: {
    punctuality: number
    cleanliness: number
    pricing: number
    quality: number
    attitude: number
  }
}

export interface Booking {
  id: string
  craftsman: Craftsman
  service: string
  serviceAr: string
  date: string
  time: string
  status: BookingStatus
  address: string
  notes: string
  totalAmount: number
  paymentMethod: PaymentMethod
  photos: string[]
}

export interface Category {
  id: string
  icon: string // lucide icon name
  labelAr: string
  labelEn: string
  count: number
}

export interface Review {
  id: string
  author: string
  authorAvatar: string
  date: string
  rating: number
  ratings: {
    punctuality: number
    cleanliness: number
    pricing: number
    quality: number
    attitude: number
  }
  text: string
  textAr: string
  photos: string[]
}

export interface Message {
  id: string
  sender: 'user' | 'craftsman'
  text: string
  timestamp: string
  attachment?: {
    type: 'image' | 'file'
    url: string
    name: string
  }
}

export interface PaymentCard {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  holderName: string
}

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  joinedDate: string
  addresses: {
    id: string
    label: string
    street: string
    city: string
    zipCode: string
    isDefault: boolean
  }[]
}

export interface Emergency {
  id: string
  type: EmergencyType
  status: JobStatus
  craftsman?: Craftsman
  location: {
    latitude: number
    longitude: number
    address: string
  }
  createdAt: string
  arrivedAt?: string
  completedAt?: string
  notes: string
  totalAmount?: number
}

export interface Job {
  id: string
  bookingId: string
  status: JobStatus
  timeline: {
    status: JobStatus
    timestamp: string
  }[]
  craftsman: Craftsman
  estimatedDuration: number // minutes
  actualDuration?: number
  location: {
    latitude: number
    longitude: number
    address: string
  }
  messages: Message[]
}
