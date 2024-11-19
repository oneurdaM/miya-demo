import {useQuery,useMutation,useQueryClient} from 'react-query'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import {Router, useRouter} from 'next/router'

import {API_ENDPOINTS} from './client/api-endpoints'
import {userClient} from './client/user'
import {AUTH_CRED} from '@/utils/constants'
import {Routes} from '@/config/routes'
import {DocumentsByIdResponse, UserPagination, UsersResponse} from '@/types/users'
import { roundClient } from './client/round'
import { QueryOptionsType } from '@/types'
import { RoundsReponse, roundsPargination } from '@/types/rounds'
import { mapPaginatorData } from '@/utils/data-mappers'


export const roundRegisterMutation = () => {
  const {t} = useTranslation()

const Router = useRouter();

  const queryClient = useQueryClient()

  return useMutation(roundClient.register,{
    onSuccess() {

      setTimeout(() => {
        Router.back()

      }, 1000);
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROUND)
    },
  })
}

export const useRoundsquery = (params: Partial<QueryOptionsType>) => {
  const {data,isLoading,error} = useQuery<roundsPargination,Error>(
    [API_ENDPOINTS.ROUND,params],
    () => roundClient.fetchRounds(params),
    {
      keepPreviousData: true,
    }
    
  )

  return {
    rounds: data?.data as RoundsReponse[],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}


export const useRoundQueryId = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<RoundsReponse,Error>(
    [API_ENDPOINTS.CHECKPOINT,id],
    () => roundClient.get({id}),
    {
      keepPreviousData: true,
    }
    
  )
  return {
    round: data,
    loading: isLoading,
    error,
  }
}

export const useUpdateRoundMutation = () => {

  const router = useRouter();
  const queryClient = useQueryClient()
  const {t} = useTranslation()

  return useMutation(roundClient.updateRound,{
    onSuccess: () => {
      toast.success(t('common:successfully-updated'),{
        toastId: 'successfully-updated',
      })

      router.back();
      
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROUND)
    },
  })
}

export const useCheckpointDeleteMutation = () => {
  const {t} = useTranslation()
  
    const queryClient = useQueryClient()
  
    return useMutation(roundClient.deleteCheckpoint, {
      onSuccess() {
        toast.success(t("common:successfully-deleted"))
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ROUND)
      },
    })
  }

  export const useCheckpointByIdRoudQuery = ({id}: {id: number}) => {
    const {data,isLoading,error} = useQuery<any,Error>(
      [API_ENDPOINTS.ROUND,id],
      () => roundClient.getCheckpointByRoundId({id}),
      {
        keepPreviousData: true,
      }
    )
    return {
      checkpoint: data?.data,
      loading: isLoading,
      error,
    }
  }

  export const useCheckpointByIQuery = ({id}: {id: number}) => {
    const {data,isLoading,error} = useQuery<any,Error>(
      [id],
      () => roundClient.getCheckpointById({id}),
      {
        keepPreviousData: true,
      }
    )
    return {
      checkpoint: data || [],
      loading: isLoading,
      error,
    }
  }

  export const useUpateCheckpointMutation = () => {
    const queryClient = useQueryClient();
    const {t} = useTranslation();
  
    return useMutation(roundClient.updateCheckpoint,{
      onSuccess() {
        queryClient.invalidateQueries(API_ENDPOINTS.CHECKPOINT);
        toast.success(t('common:successfully-updated'));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CHECKPOINT);
      },
      onError() {
        toast.error(t('common:unsuccessful'));
      },
    });
  }


export const checkpointRegisterMutation = () => {
  const {t} = useTranslation()

const Router = useRouter();

  const queryClient = useQueryClient()

  return useMutation(roundClient.registerCheckpoint,{
    onSuccess() {

      setTimeout(() => {
        Router.back()

      }, 1000);
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CHECKPOINT)
    },
  })
}

export const useAddUserToRound = () => {
  const { t } = useTranslation();
  const Router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(roundClient.addUserToRound,{
    onSuccess() {

      setTimeout(() => {
        Router.back()

      }, 1000);
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CHECKPOINT)
    },
    }
  );
}
