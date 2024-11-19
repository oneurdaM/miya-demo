import {
    BlockUserInput,
    DocumentQueryOptions,
    ForgetPasswordInput,
    LoginInput,
    MakeRoleInput,
    ResetPasswordInput,
    UserQueryOptions,
    VerifyForgetPasswordTokenInput,
  } from '@/types/index'
  import {API_ENDPOINTS} from './api-endpoints'
  import {HttpClient} from './http-client'
  import {crudFactory} from './crud-factory'
  import {User} from '@/types/suggestions'
  import {QueryOptions} from 'react-query'
import { RoundRegistration, RoundsReponse, roundsPargination } from '@/types/rounds'
  
  export const roundClient = {
    ...crudFactory<RoundRegistration,QueryOptions,any>(API_ENDPOINTS.ROUND),
 
    register: (variables: RoundRegistration) => {
      return HttpClient.post(API_ENDPOINTS.ROUND,variables)
    },

    fetchRounds: ({search,...params}: Partial<UserQueryOptions>) => {
        return HttpClient.get<roundsPargination>(API_ENDPOINTS.ROUND,{
          ...params,
          search: search,
        })
      },

      get: ({id}: {id: number}) => {
        return HttpClient.get<RoundsReponse>(`${API_ENDPOINTS.ROUND}/${id}`)
      },

      getCheckpointByRoundId: ({id}: {id: number}) => {
        return HttpClient.get<RoundsReponse>(`${API_ENDPOINTS.CHECKPOINT}/round/active/${id}`)
      },
      getCheckpointById: ({id}: {id: number}) => {
        return HttpClient.get<RoundsReponse>(`${API_ENDPOINTS.CHECKPOINT}/${id}`)
      },

      updateRound: (variables: RoundsReponse) => {
        return HttpClient.put(`${API_ENDPOINTS.ROUND}/${variables.id}`,variables)
      },


      deleteCheckpoint({ id }: { id: string }) {
        return HttpClient.delete<boolean>(`${API_ENDPOINTS.CHECKPOINT}/${id}`)
      },

      updateCheckpoint: (variables: any) => {
        return HttpClient.put(`${API_ENDPOINTS.CHECKPOINT}/${variables.id}`,variables)
      },

      registerCheckpoint: (variables: any) => {
        return HttpClient.post(API_ENDPOINTS.CHECKPOINT,variables)
      },

      addUserToRound: (variables: any) => {
        return HttpClient.post(API_ENDPOINTS.ROUND + "/addUserTo",variables)
      },
  
  
  }
  