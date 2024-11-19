import { useQuery } from 'react-query'
import { API_ENDPOINTS } from './client/api-endpoints'
import { trackerClient } from './client/tracker'

export const useTrackingUserQuery = ({ id }: { id: number }) => {
  return useQuery<any, Error>([API_ENDPOINTS.TRACK_USER, id], () =>
    trackerClient.trackUser({ id })
  )
  
}

export const useTrackingByIdUserQuery = ({ id, start, end }: { id: string, start: string, end: string },enabled: boolean) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.TRACKERBYIDUSER, id, start, end],
    () =>  trackerClient.trackByUser(id, start, end),
    {
      keepPreviousData: false
    }
  );
};