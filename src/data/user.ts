import {useQuery,useMutation,useQueryClient} from 'react-query'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'

import {API_ENDPOINTS} from './client/api-endpoints'
import {userClient} from './client/user'
import {AUTH_CRED} from '@/utils/constants'
import {Routes} from '@/config/routes'
import {DocumentsByIdResponse, UserPagination, UsersResponse} from '@/types/users'
import { DocumentsPagination } from '@/types/documents'
import { mapPaginatorData } from '@/utils/data-mappers'
import { QueryOptionsTrakcer, QueryOptionsType, QueryOptionsTypeDocument } from '@/types'



export function useLogin() {
  return useMutation(userClient.login)
}
export const useMeQuery = () => {
  const { data, isLoading, error } = useQuery<any, Error>(
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
  const router = useRouter()
  Cookies.remove(AUTH_CRED)
  router.replace(Routes.login)
  return {
    isSuccess: true,
  }
}

export const useLogoutMutation3 = ({ user }: any) => {
  const router = useRouter();

  const logoutUser = async () => {
    try {
      await userClient.logout({ user });
      Cookies.remove(AUTH_CRED);
      router.replace(Routes.login);

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    logout: logoutUser
  };
};

export const useUpdateUserMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()

  return useMutation(userClient.update,{
    onSuccess() {
      toast.success(t('common:successfully-updated'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME)
      queryClient.invalidateQueries(API_ENDPOINTS.USERS)
    },
  })
}

export const useForgetPasswordMutation = () => {
  return useMutation(userClient.forgetPassword)
}

export const useResetPasswordMutation = () => {
  return useMutation(userClient.resetPassword)
}

export const useVerifyForgetPasswordTokenMutation = () => {
  return useMutation(userClient.verifyForgetPasswordToken)
}

export const useUserQuery = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<UsersResponse,Error>(
    [API_ENDPOINTS.USERS,id],
    () => userClient.get({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    user: data,
    loading: isLoading,
    error,
  }
}


export const useTrackQuerywhitParams = (params: Partial<QueryOptionsType>) => {
  const {data,isLoading,error} = useQuery<UserPagination,Error>(
    [API_ENDPOINTS.TRACK,params],
    () => userClient.fetchTracker(params),
  )
  return {
//@ts-ignore
    data: data?.tracking,
    loading: isLoading,
    error,
  }
}

export const useUserByIdWithouTrackingQuery = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<UsersResponse,Error>(
    [API_ENDPOINTS.USERSPROFILE,id],
    () => userClient.getProfile({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    userById: data,
    loading: isLoading,
    error,
  }
}


export const useUserCheckpointQuery = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<UsersResponse,Error>(
    [API_ENDPOINTS.USERS,id],
    () => userClient.getCheckpoint({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    user: data,
    loading: isLoading,
    error,
  }
}


export const userDocumentByIdQuery = (params: Partial<QueryOptionsTypeDocument>,) => {
  const {data,isLoading,error} = useQuery<DocumentsPagination,Error>(
    [API_ENDPOINTS.DOCUMENTSBYIDUSER,params],
    () => userClient.documentByUser(params),
    {
      keepPreviousData: true,
    }
  )

  return {
    documents: data?.documents,
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}

export const documentByIdQuery = ({id}: {id: number}) => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.DOCUMENTSBYIDUSER,id],
    () => userClient.documentById({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    document: data,
    loading: isLoading,
    error,
  }
}



export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  return useMutation(userClient.delete,{
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};


export const userInConversationsMutation = ({id}: {id: any}) => {

  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.USERS+"/userInConversations",id],
    () => userClient.userInConversation({id}),
    {
      keepPreviousData: true,
    }
  )

  return {
    userIds: data,
    loading: isLoading,
    error,
  }
}