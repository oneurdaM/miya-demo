import {useQuery} from 'react-query'

import {Attendance,AttendancePaginator,QueryOptionsType, QueryOptionsTypeAttendence} from "@/types";
import {API_ENDPOINTS} from './client/api-endpoints';
import {attendanceClient} from './client/attendances';
import {mapPaginatorData} from '@/utils/data-mappers';

export const useAttendancesQuery = (options: Partial<QueryOptionsTypeAttendence>) => {
	const {data,isLoading,error} = useQuery<AttendancePaginator,Error>(
		[API_ENDPOINTS.ATTENDANCES,options],
		() => attendanceClient.paginated(options),
		{
			keepPreviousData: true,
		}
	)


	return {
		attendances: data?.data,
		loading: isLoading,
		paginatorInfo: mapPaginatorData(data as any),
		error,
	}
}