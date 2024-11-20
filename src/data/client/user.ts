import {
  BlockUserInput,
  DocumentQueryOptions,
  DocumentsQueryOptions,
  ForgetPasswordInput,
  LoginInput,
  MakeRoleInput,
  ResetPasswordInput,
  UserQueryOptions,
  UserQueryOTrackptions,
  VerifyForgetPasswordTokenInput,
} from '@/types/index'
import {DocumentsByIdResponse,DocumentsData,UserPagination,UserRegistration,UserTracker,UsersResponse} from '@/types/users'
import {API_ENDPOINTS} from './api-endpoints'
import {HttpClient} from './http-client'
import {crudFactory} from './crud-factory'
import {User} from '@/types/suggestions'
import {QueryOptions} from 'react-query'
import {DocumentsPagination} from '@/types/documents'

export const userClient = {
  ...crudFactory<User,QueryOptions,any>(API_ENDPOINTS.USERS),

  fetchUsers: ({search,...params}: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPagination>(API_ENDPOINTS.USERS,{
      ...params,
      search: search,
    })
  },
  fetchUsersTracker: () => {
    return HttpClient.get<UserTracker>(API_ENDPOINTS.USERTRACKING)
  },
  fetchAdmins: ({search,...params}: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPagination>(API_ENDPOINTS.ADMIN_LIST,{
      ...params,
      search: search,
    })
  },


  fetchTracker: ({id,...params}: Partial<UserQueryOTrackptions>) => {
    return HttpClient.get<UserPagination>(`${API_ENDPOINTS.TRACK}/${id}`,{
      ...params,
    });
  },
  trackUser: (variables: {id: number}) => {
    return HttpClient.get(`${API_ENDPOINTS.TRACK_USER}/${variables.id}`)
  },
  userJob: (id: any) => {
    return HttpClient.get(`${API_ENDPOINTS.USERJOB}/${id}`)
  },
  verifyForgetPasswordToken: (variables: VerifyForgetPasswordTokenInput) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
      variables
    )
  },
  register: (variables: UserRegistration) => {
    return HttpClient.post(API_ENDPOINTS.REGISTER,variables)
  },
  login: (variables: LoginInput) => {
    return HttpClient.post(API_ENDPOINTS.LOGIN,variables)
  },
  me: () => {
    return HttpClient.get<UsersResponse>(API_ENDPOINTS.ME)
  },
  unblock: (variables: BlockUserInput) => {
    return HttpClient.put(
      `${API_ENDPOINTS.USERS}/${variables.id}/unblock`,
      variables
    )
  },
  block: (variables: BlockUserInput) => {
    return HttpClient.put(
      `${API_ENDPOINTS.USERS}/${variables.id}/block`,
      variables
    )
  },
  // modify role of user
  modifyRole: (variables: MakeRoleInput) => {
    return HttpClient.put(
      `${API_ENDPOINTS.USERS}/${variables.id}/role`,
      variables
    )
  },
  createUser: (variables: UserRegistration) => {
    return HttpClient.post(API_ENDPOINTS.CREATEUSER,variables)
  },

  update: (variables: UsersResponse) => {
    return HttpClient.put(`${API_ENDPOINTS.USERS}/${variables.id}`,variables)
  },
  resetPassword: (variables: ResetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.RESET_PASSWORD,variables)
  },
  changePassword: (variables: {newPassword: string}) => {
    return HttpClient.post(`${API_ENDPOINTS.UPDATE_PASSWORD}`,variables)
  },


  logout: (variables: {user: any}) => {
    return HttpClient.post(`${API_ENDPOINTS.LOGOUT}`,variables)
  },
  forgetPassword: (variables: ForgetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.FORGET_PASSWORD,variables)
  },
  get: ({id}: {id: number}) => {
    return HttpClient.get<UsersResponse>(`${API_ENDPOINTS.USERS}/${id}`)
  },

  getProfile: ({id}: {id: number}) => {
    return HttpClient.get<UsersResponse>(`${API_ENDPOINTS.USERSPROFILE}/${id}`)
  },

  getCheckpoint: ({id}: {id: number}) => {
    return HttpClient.get<UsersResponse>(`${API_ENDPOINTS.USERS}/round/${id}`)
  },

  documentByUser: ({...params}: Partial<DocumentsQueryOptions>) => {
    return HttpClient.get<DocumentsPagination>(`${API_ENDPOINTS.DOCUMENTSBYIDUSER}/${params.id}`,{
      ...params
    })
  },

  documentById: ({id}: {id: number}) => {
    return HttpClient.get<DocumentsData>(`${API_ENDPOINTS.DOCUMENTS}/${id}`)
  },
  documentByIdUpdate: (id: any,data: any) => {
    return HttpClient.put(
      `${API_ENDPOINTS.DOCUMENTS}/documents/${id}`,
      data
    )
  },
  fetchDocuments: ({search,...params}: Partial<DocumentQueryOptions>) => {
    return HttpClient.get<any>(API_ENDPOINTS.DOCUMENTS,{
      ...params,
      search: search,
    })
  },

  userInConversation: ({id}: {id: number}) => {
    return HttpClient.get<DocumentsData>(`${API_ENDPOINTS.USERS}/userInConversations/${id}`)
  },

  fetchJobPositions: () => {
    return HttpClient.get<any>(API_ENDPOINTS.JOB_POSITION)
  }

}
