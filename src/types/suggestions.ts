import {Suggestion} from '@testing-library/react'

export type suggestionsPagination = {
  suggestions: Suggestion[]
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface SuggestionsResponse {
  id: number
  slug: string
  content: string
  userId: number
  createdAt: Date
  user: User
  rating: number
}

export interface Shift {
  id: number | string
  name: string
  start: string // iso string date
  end: string // iso string date
  createdAt: string // iso string date
  updatedAt: string // iso string date
  users: User[]
}

export interface Sector {
  id: number | string
  name: string
  createdAt: string // iso string date
  updatedAt: string // iso string date
}


export interface User {
  documents: any
  id: number
  name: string
  username: string
  firstName: string
  lastName: string
  email: string
  image: null
  registration: Date
}
