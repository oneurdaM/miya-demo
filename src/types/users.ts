import { t } from 'i18next'
import {Alert} from './alerts'
import {Shift} from './suggestions'
import { useTranslation } from 'react-i18next'

export interface UsersResponse {
  sector: any,
  icon:string,
  user: {
    name:string
  }
  label?: any
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  middleName?: null
  image?: null
  emailVerified?: boolean
  birthDate?: null
  registrationDate?: Date
  lastSeen?: Date
  role: string
  banned: boolean
  online: boolean
  oneSignalId?: null
  environmentId?: number
  alerts?: Alert[]
  conversations?: any[]
  tracking?: Tracking[]
  shift?: Shift
  jobPositionId:number
  jobPosition?: {
    createdAt: string,
    id:number,
    name:string,
    requireDocuments:requireDocuments[]
  }
  round_roundParticipants?:  RoundParticipe[]
  checkpointLog?: checkpointLogData[]
  documents?: any[] | any
}

export interface requireDocuments {
  name:string,
  id:number,
  slug:string
}

export interface checkpointLogData {
  id: number, 
  checkpointId: number, 
  guardId: number, 
  roundId: number, 
  checkpoint: {
    location:string
    id:number
  }
  timestamp:string
}

export interface RoundParticipe {
  id: number,
  name: string ,
  start: string,
  end: string,
  status: string,
  timestamp: string
}

export interface DocumentsByIdResponse{
  message: string,
  data: DocumentsData,
}

export interface DocumentsData {
  id: number
  userId: number,
  documentType: string,
  filePath: string,
  valid: boolean,
  issuedAt: string,
  validUntil: boolean
}

export enum JobPosition {
  GUARD = 'GUARD',
  PARKING_ENFORCER = 'PARKING_ENFORCER',
  GUARD_SSU = 'GUARD_SSU',
  INSPECTOR_PIPEM_AC = 'INSPECTOR_PIPEM_AC',
  INSPECTOR_HBS = 'INSPECTOR_HBS',
  INSPECTOR_SOC = 'INSPECTOR_SOC',
  FACILITATION_ASSISTANT = 'FACILITATION_ASSISTANT',
  SUPERVISOR = 'SUPERVISOR',
  HEAD_OF_SERVICE = 'HEAD_OF_SERVICE',
  CANINE_BINOMIAL = 'CANINE_BINOMIAL',
}

export enum DocumentTypeName {
  EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
  CRIMINAL_RECORD_LETTER = "CRIMINAL_RECORD_LETTER",
  MEDICAL_EXAMINATION = "MEDICAL_EXAMINATION",
  PSYCHOLOGICAL_FIT_CERTIFICATE = "PSYCHOLOGICAL_FIT_CERTIFICATE",
  TRUST_EXAM = "TRUST_EXAM",
  TOXICOLOGICAL_EXAM = "TOXICOLOGICAL_EXAM",
  COMMON_TRUNK_CERTIFICATE = "COMMON_TRUNK_CERTIFICATE",
  CERTIFICATES_OF_SPECIALITIES = "CERTIFICATES_OF_SPECIALITIES",
  EC1099_PIPEM_INSPECTORS = "EC1099_PIPEM_INSPECTORS",
  EC1102_HBS_INSPECTORS = "EC1102_HBS_INSPECTORS",
  SAFETY_AND_HYGIENE_CERTIFICATE = "SAFETY_AND_HYGIENE_CERTIFICATE",
  TRAINING_FROM_THE_LOCAL_AIRPORT_SECURITY_PROGRAM = "TRAINING_FROM_THE_LOCAL_AIRPORT_SECURITY_PROGRAM",
  MRX_OPERATION_RECORD = "MRX_OPERATION_RECORD",
  DMP_OPERATION_RECORD = "DMP_OPERATION_RECORD",
  ETD_OPERATION_RECORD = "ETD_OPERATION_RECORD",
  CTX_OPERATION_RECORD = "CTX_OPERATION_RECORD",
  CCTV_OPERATION_RECORD = "CCTV_OPERATION_RECORD",
  RECORD_SECURITY_SURVEILLANCE_PROPERTY_REAL_STATE = "RECORD_SECURITY_SURVEILLANCE_PROPERTY_REAL_STATE",
  RECORD_IN_PERSONAL_DEFENSE = "RECORD_IN_PERSONAL_DEFENSE",
  RECORD_PHYSICAL_CONDITION = "RECORD_PHYSICAL_CONDITION",
  RECORD_IN_DEALING_WITH_THE_PUBLIC = "RECORD_IN_DEALING_WITH_THE_PUBLIC",
  RECORD_FIRST_AID = "RECORD_FIRST_AID",
  RECORD_RADIO_COMMUNICATION = "RECORD_RADIO_COMMUNICATION",
  RECORD_PREPARING_REPORTS = "RECORD_PREPARING_REPORTS",
  CERTIFICATE_OF_STUDIES = "CERTIFICATE_OF_STUDIES",
  CURP = "CURP",
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  CUIP = "CUIP",
  OFFICIAL_IDENTIFICATION = "OFFICIAL_IDENTIFICATION",
  PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS",
  JOB_APPLICATION = "JOB_APPLICATION",
  IMSS_REGISTRATION = "IMSS_REGISTRATION",
}

export interface Tracking {
  id: number
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
  userId: number
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
  Operator = 'OPERATOR',
}

export type UserPagination = {
  users: UsersResponse[]
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type UserTRacking = {
  tracking: Tracking[]

}


export type UserTracker = {
  id: Number,
  latitude: any,
  longitude: any,
  createdAt: any,
  updatedAt: any,
  userId:Number
}

export type UserRegistration = {
  email: string
  username: string
  password: string
  firstName: string
  middleName?: string | null
  lastName: string
  environmentId?: number | null
  shiftId: string | number | null
}


export const userJobPosition = ()=>{
  
  const { t } = useTranslation()

  return [
    {
      id: 1,
      label: t('form:input-label-guard'),
      value: 'GUARD',
    },
    {
      id: 2,
      label: t('form:input-label-parking-enforcer'),
      value: 'PARKING_ENFORCER',
    },
  
    {
      id: 3,
      label: t('form:input-label-guard-ssu'),
      value: 'GUARD_SSU',
    },
    {
      id: 4,
      label: t('form:input-label-pipem-ac'),
      value: 'INSPECTOR_PIPEM_AC',
    },
    {
      id: 5,
      label: t('form:input-label-hbs'),
      value: 'INSPECTOR_HBS',
    },
    {
      id: 6,
      label: t('form:input-label-soc'),
      value: 'INSPECTOR_SOC',
    },
    {
      id: 7,
      label: t('form:input-label-facilitation-assistant'),
      value: 'FACILITATION_ASSISTANT',
    },
    {
      id: 8,
      label: t('form:input-label-supervisor'),
      value: 'SUPERVISOR',
    },
    {
      id: 9,
      label: t('form:input-label-head-of-service'),
      value: 'HEAD_OF_SERVICE',
    },
    {
      id: 10,
      label: t('form:input-label-canine-binomial'),
      value: 'CANINE_BINOMIAL',
    },
  ]


}

export const switchJobPosition = (position:string) => {
  const { t } = useTranslation()

  let jobposition : string
  switch (position) {
    case 'GUARD':
      jobposition =  t('form:input-label-guard')
      break;
    case 'PARKING_ENFORCER':
      jobposition =  t('form:input-label-parking-enforcer')

      break;
    case 'GUARD_SSU':
      jobposition = t('form:input-label-guard-ssu')
      break;
    case 'INSPECTOR_PIPEM_AC':
      jobposition =  t('form:input-label-pipem-ac')
      break;
    case 'INSPECTOR_HBS':
      jobposition = t('form:input-label-hbs')
      break;
    case 'INSPECTOR_SOC':
      jobposition = t('form:input-label-soc')
      break;
    case 'FACILITATION_ASSISTANT':
      jobposition =  t('form:input-label-facilitation-assistant')
      break;
    case 'SUPERVISOR':
      jobposition = t('form:input-label-supervisor')
      break;
    case 'HEAD_OF_SERVICE':
      jobposition =  t('form:input-label-head-of-service')
      break;
    case 'CANINE_BINOMIAL':
      jobposition = t('form:input-label-canine-binomial')
      break;
    default:
      jobposition =  t('form:input-label-guard')
      break;
  }
  return jobposition
};


