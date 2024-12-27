import { QueryOptionsType } from "@/types"
import { JobPosition, JobPositionResponse } from "@/types/job-position"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { API_ENDPOINTS } from "./client/api-endpoints"
import { JobPositionClient } from "./client/job-position"
import { mapPaginatorData } from "@/utils/data-mappers"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { DocumentTypeClient } from "./client/documents_type"



export const useDocumentTypeQuery = (options: Partial<QueryOptionsType>) => {
    const { data, isLoading, error } = useQuery<JobPositionResponse, Error>(
      [API_ENDPOINTS.DOCUMENTS+"/type/doc", options],
      () => DocumentTypeClient.paginated(options),
      {
        keepPreviousData: true,
      }
    )
  
    return {
      documents: data?.data,
      loading: isLoading,
      paginatorInfo: mapPaginatorData(data as any),
      error,
    }
  }


  export const useCreateDocumentTypeMutation = () => {
    const {t} = useTranslation()
    
      const queryClient = useQueryClient()
      const router = useRouter()
      return useMutation(DocumentTypeClient.create, {
        onSuccess: () => {
          toast.success(t('common:successfully-created'))
        },
        onSettled: () => {
          queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS+"/type/doc")
        },
      })
    }

    export const useDocumentTypeByIdQuery = ({ id }: { id: string }) => {
      const { data, error, isLoading } = useQuery<any, Error>(
        [API_ENDPOINTS.DOCUMENTS+"/type/doc", { id }],
        () => DocumentTypeClient.get({ id })
      )
    
      return {
        documentType: data?.data,
        error,
        loading: isLoading,
      }
    }

    export const useUpdateDocumentTypeMutation = () => {
      const {t} = useTranslation()
      
        const queryClient = useQueryClient()
        return useMutation(DocumentTypeClient.update, {
          onSuccess: () => {
            toast.success(t('common:successfully-updated'))
          },
          onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS+"/type/doc")
          },
        })
      }

      export const useDocumentTypeDeleteMutation = () => {
        const queryClient = useQueryClient()
        const {t} = useTranslation()
      
      
        return useMutation(DocumentTypeClient.delete,{
          onSuccess() {
            toast.success(t("common:successfully-deleted"))
          },
          onSettled: () => {
            queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS+"/type/doc")
          }
        })
      }
      