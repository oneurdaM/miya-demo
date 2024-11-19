import { HttpClient } from './http-client'
import { API_ENDPOINTS } from './api-endpoints'
import { AnalyticsResponse } from '@/types/analytics'
import { DocumentQueryOptions, QueryOptionsTypeSector } from '@/types'

export const analyticsClient = {
  fetchAnalytics: () => {
    return HttpClient.get<AnalyticsResponse>(API_ENDPOINTS.ANALYTICS)
  },

  register: (variables: any) => {
    return HttpClient.post(API_ENDPOINTS.SECTOR,variables)
  },
  
  fetchSECTORstence: ({shiftId}: Partial<QueryOptionsTypeSector>) => {
    const params: any = {};

    // Incluir shiftId solo si no está vacío
    if (shiftId) {
      params.shiftId = shiftId;
    }
  
    return HttpClient.get<any>(API_ENDPOINTS.SECTOR, params);
  },

  fetchSectorList: ({search,...params}: Partial<DocumentQueryOptions>) => {
    return HttpClient.get<any>(API_ENDPOINTS.SECTOR +"/sector-list",{
      ...params,
      search: search,
    })
  },

  get: ({id}: {id: number}) => {
    return HttpClient.get<any>(`${API_ENDPOINTS.SECTOR}/${id}`)
  },

  updateSector: (id:any, data: any) => {
    return HttpClient.put(
      `${API_ENDPOINTS.SECTOR}/${id}`,
      data
    )
  },
}
