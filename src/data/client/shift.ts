import {QueryOptions} from 'react-query';

import {HttpClient} from './http-client'
import {API_ENDPOINTS} from './api-endpoints';
import {crudFactory} from './crud-factory';
import {QueryOptionsType} from '@/types';

export const shiftClient = {
	...crudFactory<any,QueryOptions,any>(
		API_ENDPOINTS.SHIFTS
	),
	pagination: ({
		search,
		...params
	}: Partial<QueryOptionsType>) => {
		return HttpClient.get<any>(API_ENDPOINTS.SHIFTS,{
			...params,
			search: search,
		})
	},

	get: ({id}: {id: number}) => {
        return HttpClient.get<any>(`${API_ENDPOINTS.SHIFTS}/${id}`)
      },
}