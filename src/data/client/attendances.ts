import {HttpClient} from './http-client'
import {API_ENDPOINTS} from "./api-endpoints"

import {AttendancePaginator,GenericQueryOptions} from "@/types"


export const attendanceClient = {
	paginated: ({search,...params}: Partial<GenericQueryOptions>) => {
		return HttpClient.get<AttendancePaginator>(API_ENDPOINTS.ATTENDANCES,{
			...params,
			search: search,
		})
	},
}