
export type RoundRegistration = {
  name: string
  start: Date
  end: Date
  status: string
}

export type roundsPargination = {
    data: RoundsReponse[]
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  
  export interface RoundsReponse {
    id: number
    name: string
    start: string,
    end: string
    status: string,
    checkpoint: [
      {
        name: string
        id:number
        location: string
        longitude: string
        latitude: string
        time: string
      },
    ]
  }