import {QueryOptions} from 'react-query'

import {HttpClient} from './http-client'
import {API_ENDPOINTS} from './api-endpoints'
import {crudFactory} from './crud-factory'


export const documentClient = {
	...crudFactory<any,QueryOptions,any>(
		API_ENDPOINTS.DOCUMENTS
	),
	fetchDocuments: ({
		search,
		...params
	}: Partial<any>) => {
		return HttpClient.get<any>(API_ENDPOINTS.DOCUMENTS,{
			...params,
			search: search,
		})
	},
	getTypes: () => {
		return HttpClient.get<any>(API_ENDPOINTS.DOCUMENTTYPES)
	},
	getRequiredDocuments: (userId: string) => {
		// documents/required/:id
		return HttpClient.get<any>(`${API_ENDPOINTS.REQUIREDDOCUMENTS}/${userId}`)
	},
	deleteDocumentType: (id: string) => {
		return HttpClient.delete<any>(`${API_ENDPOINTS.DOCUMENTTYPES}/${id}`)
	}
}