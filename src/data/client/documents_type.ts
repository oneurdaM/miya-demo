/* eslint-disable @typescript-eslint/no-explicit-any */
import {API_ENDPOINTS} from '@/data/client/api-endpoints'
import {HttpClient} from '@/data/client/http-client'
import {JobPosition,QueryOptions} from '@/types'
import {crudFactory} from './crud-factory'
import {JobPositionResponse} from '@/types/job-position'

export const DocumentTypeClient = {
  ...crudFactory<JobPosition,QueryOptions,any>(API_ENDPOINTS.DOCUMENTS + "/type/doc"),
  paginated: ({search,...params}: QueryOptions) => {
    return HttpClient.get<JobPositionResponse>(API_ENDPOINTS.DOCUMENTS + "/type/doc",{
      ...params,
      search,
    })
  },
}
