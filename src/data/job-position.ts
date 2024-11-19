import {useMutation,useQuery,useQueryClient} from "react-query"
import {API_ENDPOINTS} from "./client/api-endpoints"
import {JobPositionClient} from "./client/job-position"
import {mapPaginatorData} from "@/utils/data-mappers"
import {useTranslation} from "react-i18next"
import {useRouter} from "next/router"
import {toast} from "react-toastify"



export const useJobPositionQuery = (receivedData?: any) => {
  const {data,isLoading,error} = useQuery<any,Error>(
    [API_ENDPOINTS.JOB_POSITION],
    () => JobPositionClient.getJobposition(receivedData),
    {
      keepPreviousData: true,
    }
  )

  return {
    jobposition: data,
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}


export const useobPositionByIdQuery = ({id}: {id: string}) => {
  const {data,error,isLoading} = useQuery<any,Error>(
    [API_ENDPOINTS.JOB_POSITION,{id}],
    () => JobPositionClient.get({id})
  )

  return {
    jobPosition: data,
    error,
    loading: isLoading,
  }
}


export const useCreateJobPositionMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation(JobPositionClient.create,{
    onSuccess: () => {
      toast.success(t('common:successfully-created'))
      router.back()
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.JOB_POSITION)
    },
  })
}


export const useUpdateJobPositionMutation = () => {
  const {t} = useTranslation()

  const queryClient = useQueryClient()
  return useMutation(JobPositionClient.update,{
    onSuccess: () => {
      toast.success(t('common:successfully-updated'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.JOB_POSITION)
    },
  })
}

export const useAddDocumentsToJobposition = () => {
  const {t} = useTranslation();
  const Router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(JobPositionClient.addDocumentToJobposition,{
    onSuccess() {

      toast.success(t('common:successfully-created'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.JOB_POSITION)
    },
  }
  );
}

export const useJobpositionDeleteMutation = () => {
  const queryClient = useQueryClient()
  const {t} = useTranslation()


  return useMutation(JobPositionClient.delete,{
    onSuccess() {
      toast.success(t("common:successfully-deleted"))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.JOB_POSITION)
    }
  })
}

export const useJobpositionUnlinkDocumentMutation = () => {
  const queryClient = useQueryClient()
  const {t} = useTranslation()


  return useMutation(JobPositionClient.unLinkDocument,{
    onSuccess() {
      toast.success(t("common:successfully-deleted"))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.JOB_POSITION)
    }
  })
}


export const useJobpositionByIdQuery = ({id}: {id: string}) => {
  const {data,error,isLoading} = useQuery<any,Error>(
    [API_ENDPOINTS.JOB_POSITION,{id}],
    () => JobPositionClient.get({id})
  )

  return {
    jobposition: data,
    error,
    loading: isLoading,
  }
}