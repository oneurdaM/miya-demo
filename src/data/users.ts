/* eslint-disable @typescript-eslint/no-explicit-any */
import {UserPagination,UserTracker,UsersResponse} from '@/types/users'
import {AUTH_CRED} from '@/utils/constants'
import {mapPaginatorData} from '@/utils/data-mappers'
import Cookies from 'js-cookie'
import {useMutation,useQuery,useQueryClient} from 'react-query'
import {toast} from 'react-toastify'
import {QueryOptionsType} from '../types'
import {API_ENDPOINTS} from './client/api-endpoints'
import {userClient} from './client/user'
import {useTranslation} from 'react-i18next'



export const useUsersQuery = (params: Partial<QueryOptionsType>) => {
  const {data,isLoading,error} = useQuery<UserPagination,Error>(
    [API_ENDPOINTS.USERS,params],
    () => userClient.fetchUsers(params),
    {
      keepPreviousData: true,
    }
  )

  return {
    users: data?.users as UsersResponse[],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}

export const useAdminsQuery = (params: Partial<QueryOptionsType>) => {
  const {data,isLoading,error} = useQuery<UserPagination,Error>(
    [API_ENDPOINTS.ADMIN_LIST,params],
    () => userClient.fetchAdmins(params),
    {
      keepPreviousData: true,
    }
  )

  return {
    users: data?.users as UsersResponse[],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}

export const useUpdateUserMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.update,{
    onSuccess: () => {
      toast.success(t('common:successfully-updated'),{
        toastId: 'successfully-updated',
      })
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}

// Get JOB POSITIONS
export const useJobPositionsQuery = () => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.JOB_POSITIONS],
    () => userClient.fetchJobPositions(),
    {
      keepPreviousData: true,
    }
  )

  return {
    jobPositions: data,
    loading: isLoading,
    error,
  }
}


export const useModifyDocumentMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation((data: any) => {
    const {id,...documentData} = data; // Extraer el id y los datos del documento
    return userClient.documentByIdUpdate(id,documentData); // Llamar a la función sin el id
  },{
    onSuccess() {
      toast.success(t("common:successfully-validate-document"))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS + "/documents")
    },
  });
}

export const useUpdatePasswordMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.changePassword,{
    onSuccess() {
      toast.success(t('common:successfully-updated'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME)
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}

export const useRegisterMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.register,{
    onSuccess() {
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGISTER)
    },
  })
}

export const useCreateUserMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.createUser,{
    onSuccess() {
      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CREATEUSER)
    },
    onError() {
      toast.warning(t('Usuario ya registrado'))
    }
  })
}

export const useUnblockUserMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.unblock,{
    onSuccess() {
      toast.success(t('common:successfully-unblock'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}

export const useBlockUserMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.block,{
    onSuccess() {
      toast.success(t('common:successfully-block'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}


export const useUnblockUserAdminMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.unblock,{
    onSuccess() {
      toast.success(t('common:successfully-unblock'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERADMINS)
    },
  })
}

export const useBlockUserAdminMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.block,{
    onSuccess() {
      toast.success(t('common:successfully-block'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERADMINS)
    },
  })
}

export const useModifyRoleMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.modifyRole,{
    onSuccess() {
      toast.success(t('common:successfully-updated'))

    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}

export function useLogin() {
  return useMutation(userClient.login)
}

export const useMeQuery = () => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.ME],
    () => userClient.me(),
    {
      keepPreviousData: true,
    }
  );

  return {
    data: data ? data.user : undefined, // Verifica si data está definido antes de acceder a data.user
    loading: isLoading,
    error,
  };
};

export const useLogoutMutation = () => {
  Cookies.remove(AUTH_CRED)
  return {
    message: 'Logged out successfully',
  }
}

export const userQueryJob = (id: any) => {
  const {data,isLoading,error,refetch} = useQuery<any,Error>(

    [API_ENDPOINTS.USERJOB],
    () => userClient.userJob(id),
    {
      keepPreviousData: true,
    }
  )
  return {
    usersJob: data,
    loading: isLoading,
    error,
    refetch

  }
}


export const useUsersTrakcerQuery = () => {
  const {data,isLoading,error} = useQuery<UserTracker,Error>(
    [API_ENDPOINTS.USERTRACKING],
    () => userClient.fetchUsersTracker(),
    {
      keepPreviousData: true,
    }
  )

  return {
    usersTracking: data,
    loading: isLoading,
  }
}

export const userDocumentsQuery = (params: Partial<QueryOptionsType>) => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.DOCUMENTS,params],
    () => userClient.fetchDocuments(params),
    {
      keepPreviousData: true,
    }
  )
  return {
    documents: data?.documents ?? [],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}