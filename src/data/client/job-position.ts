/* eslint-disable @typescript-eslint/no-explicit-any */
import {API_ENDPOINTS} from '@/data/client/api-endpoints'
import {HttpClient} from '@/data/client/http-client'
import {JobPosition,QueryOptions} from '@/types'
import {crudFactory} from './crud-factory'
import {BlogResponse,CreateInputNote,Note} from '@/types/blog'
import {JobPositionResponse} from '@/types/job-position'

export const JobPositionClient = {
  ...crudFactory<JobPosition,QueryOptions,any>(API_ENDPOINTS.JOB_POSITION),
  paginated: ({search,...params}: QueryOptions) => {
    return HttpClient.get<JobPositionResponse>(API_ENDPOINTS.JOB_POSITION,{
      ...params,
      search,
    })
  },

  addDocumentToJobposition: (variables: any) => {
    return HttpClient.post(API_ENDPOINTS.JOB_POSITION + "/addDocumentTo",variables)
  },

  unLinkDocument: (variables: any) => {
    return HttpClient.patch(API_ENDPOINTS.JOB_POSITION + "/" + variables.id + "/unlink",variables)
  },


  getJobposition: (variables: any) => {
    return HttpClient.get<JobPositionResponse>(API_ENDPOINTS.JOB_POSITION,variables)
  },
}
