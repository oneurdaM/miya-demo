import {useMutation,useQueryClient} from 'react-query'
import {toast} from 'react-toastify'

import {API_ENDPOINTS} from '@/data/client/api-endpoints'
import {uploadClient} from '@/data/client/upload'

export const useUploadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (input: any) => {
      return uploadClient.upload(input)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS)
      },
    }
  )
}

export const useUploadBiometrics = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (input: any) => {
      return uploadClient.uploadBiometric(input)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.USERS)
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
    }
  )
}
