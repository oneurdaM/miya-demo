import {QueryOptionsType} from "@/types";
import {useMutation,useQuery,useQueryClient} from "react-query";
import {API_ENDPOINTS} from "./client/api-endpoints";
import {shiftClient} from "./client/shift";
import {mapPaginatorData} from "@/utils/data-mappers";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";


export const useShiftQuery = (params: Partial<QueryOptionsType>) => {
	const {data,isLoading,error} = useQuery<any,Error>(
		[API_ENDPOINTS.SHIFTS,params],
		() => shiftClient.pagination(params),
		{
			keepPreviousData: true,
		}
	);

	return {
		shifts: data?.data as [],
		loading: isLoading,
		paginatorInfo: mapPaginatorData(data as any),
		error,
	}
}



export const useShiftByIdQuery = ({id}: {id: number}) => {
	const {data,isLoading,error} = useQuery<any,Error>(
	  [API_ENDPOINTS.SHIFTS,id],
	  () => shiftClient.get({id}),
	  {
		keepPreviousData: true,
	  }
	)
  
	return {
		shift: data,
	  loading: isLoading,
	  error,
	}
  }
export const useDeleteShiftMutation = () => {
	const queryClient = useQueryClient();
	const {t} = useTranslation();

	return useMutation(shiftClient.delete,{
		onSuccess() {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
			toast.success(t('common:successfully-deleted'));
		},
		onSettled: () => {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
		},
		onError() {
			toast.error(t('common:unsuccessful'));
		},
	});
}

export const useCreateShiftMutation = () => {
	const queryClient = useQueryClient();
	const {t} = useTranslation();

	return useMutation(shiftClient.create,{
		onSuccess() {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
			toast.success(t('common:successfully-created'));
		},
		onSettled: () => {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
		},
		onError() {
			toast.error(t('common:unsuccessful'));
		},
	});
}

export const useUpateShiftMutation = () => {
	const queryClient = useQueryClient();
	const {t} = useTranslation();

	return useMutation(shiftClient.update,{
		onSuccess() {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
			toast.success(t('common:successfully-updated'));
		},
		onSettled: () => {
			queryClient.invalidateQueries(API_ENDPOINTS.SHIFTS);
		},
		onError() {
			toast.error(t('common:unsuccessful'));
		},
	});
}