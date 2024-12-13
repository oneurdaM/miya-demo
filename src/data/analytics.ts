import { AnalyticsResponse } from '@/types/analytics'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { analyticsClient } from './client/analytics'
import { API_ENDPOINTS } from './client/api-endpoints'
import { QueryOptionsType, QueryOptionsTypeSector } from '@/types'
import { sectorPargination } from '@/types/sector'
import { mapPaginatorData } from '@/utils/data-mappers'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export const useAnalyticsQuery = () => {
  const { data, isLoading, error } = useQuery<any, Error>(
    [API_ENDPOINTS.ANALYTICS],
    () => analyticsClient.fetchAnalytics(),
    {
      keepPreviousData: true,
    }
  )
  return {
    analytics: data as any,
    loading: isLoading,
    error,
  }
}

export const userSectorQuery= (params: Partial<QueryOptionsTypeSector>) => {
  const { data, isLoading, error } = useQuery<any, Error>(
    [API_ENDPOINTS.SECTOR, params],
    () => analyticsClient.fetchSECTORstence(params),
    {
      keepPreviousData: true,
    }
  )
  return {
    data: data,
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}
export const userSectorListQuery= (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<any, Error>(
    [API_ENDPOINTS.SECTOR +"/sector-list", params],
    () => analyticsClient.fetchSectorList(params),
    {
      keepPreviousData: true,
    }
  )
  return {
    sector: data?.data as [],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}


export const useCreateSectorMutation = () => {
const {t} = useTranslation()
  
  const queryClient = useQueryClient()

  return useMutation(analyticsClient.register,{
    onSuccess() {
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SECTOR)
    },
  })
}


export const useSectorPutdQuery = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.SECTOR,id],
    () => analyticsClient.get({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    sector: data?.data,
    loading: isLoading,
    error,
  }

  
}

export const useUpdateSector = () => {
const {t} = useTranslation()

  const queryClient = useQueryClient()
  const router = useRouter();
  return useMutation((data: any) => {

    return analyticsClient.updateSector(data.id ,data); 
  },{
    onSuccess() {
      toast.success(t('common:successfully-updated'))
      router.back()
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SECTOR)
    },
  });
}
