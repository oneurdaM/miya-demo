import { API_ENDPOINTS } from './api-endpoints'
import { HttpClient } from './http-client'

export const trackerClient = {
  //* latest track session of user
  trackUser: ({ id }: { id: number }) => {
    return HttpClient.get(`${API_ENDPOINTS.TRACK_USER}/${id}`)
  },

  trackByUser: (id:string, start:string, end:string ) => {
    return HttpClient.get(`${API_ENDPOINTS.TRACKERBYIDUSER}?start=${start}&end=${end}&userId=${id}`)
  },
}
