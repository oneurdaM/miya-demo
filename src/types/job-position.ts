export interface JobPosition {
    id?: number | string
    name: string
    createdAt: string
    updatedAt: string
    requiredDocuments: []
  }

  export interface JobPositionResponse {
    data: JobPosition[]
    total: number
    totalPages: number
    currentPage: number
    perPage: number
  }


  export type  JobPositionId= {
    id?: number | string
    name: string
    createdAt: string
    updatedAt: string
    requiredDocuments: []
  }
