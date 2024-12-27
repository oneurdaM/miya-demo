import {useTranslation} from "react-i18next"
import Router,{useRouter} from 'next/router'

import {useMutation,useQuery,useQueryClient} from "react-query"
import {documentClient} from "./client/documents"
import {toast} from "react-toastify"
import {Routes} from "@/config/routes"
import {Config} from "@/config"
import {API_ENDPOINTS} from "./client/api-endpoints"
import { mapPaginatorData } from "@/utils/data-mappers"

export const useUpdateDocumentatMutation = () => {
	const queryClient = useQueryClient()
	const {t} = useTranslation()

	return useMutation(documentClient.update,{
		onSuccess: () => {
			Router.push(Routes.documents.list,undefined,{
				locale: Config.defaultLanguage,
			})
			toast.success(t('common:successfully-updated'))
		},
		onSettled: () => {
			queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS)
		},
	})
}

export const useDeleteDocumentMutation = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()
  
	return useMutation(
	  (id: string) => documentClient.deleteDocumentType(id),
	  {
		onSuccess: () => {
		  toast.success(t('common:successfully-deleted'))
		},
		onError:() => {
			toast.warning('El Documento cuenta con una posicion asignada.')
		  },
		onSettled: () => {
		  queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTTYPES)
		},
	  }
	)
  }


export const useCreateDocumentMutation = () => {
	const queryClient = useQueryClient()
	const {t} = useTranslation()

	return useMutation(documentClient.create,{
		onSuccess: () => {
			Router.push(Routes.documents.list,undefined,{
				locale: Config.defaultLanguage,
			})
			toast.success(t('common:successfully-created'))
		},
		onSettled: () => {
			queryClient.invalidateQueries(API_ENDPOINTS.DOCUMENTS)
		},
	})
}

// Get documentTypes
export const useDocumentTypesQuery = () => {
	const {data,isLoading,error} = useQuery<any,Error>(
		API_ENDPOINTS.DOCUMENTTYPES,
		() => documentClient.getTypes(),
		{
			keepPreviousData: true,
		}
	)
	return {
		documentTypes: data?.data,
		loading: isLoading,
		paginatorInfo: mapPaginatorData(data as any),
		error,
	}
}



// Get only required documents by userid endpoint documents/required/:id
export const useRequiredDocumentsQuery = (id: string) => {
	const {data,isLoading,error} = useQuery<any,Error>(
		API_ENDPOINTS.REQUIREDDOCUMENTS,
		() => documentClient.getRequiredDocuments(id),
		{
			keepPreviousData: true,
		}
	)
	return {
		requiredDocuments: data?.data,
		loading: isLoading,
		error,
	}
}