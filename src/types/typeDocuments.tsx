import { useTranslation } from 'react-i18next'

export const useDocumentType = () => {
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

export const switchDocumentType = (document: string) => {
  const { t } = useTranslation()

  let documentName: string
  switch (document) {
    case 'EMPLOYMENT_CONTRACT':
      documentName = t('form:EMPLOYMENT_CONTRACT')
      break
    case 'CRIMINAL_RECORD_LETTER':
      documentName = t('form:CRIMINAL_RECORD_LETTER')

      break
    case 'MEDICAL_EXAMINATION':
      documentName = t('form:MEDICAL_EXAMINATION')
      break
    case 'PSYCHOLOGICAL_FIT_CERTIFICATE':
      documentName = t('form:PSYCHOLOGICAL_FIT_CERTIFICATE')
      break
    case 'TRUST_EXAM':
      documentName = t('form:TRUST_EXAM')
      break
    case 'TOXICOLOGICAL_EXAM':
      documentName = t('form:TOXICOLOGICAL_EXAM')
      break
    case 'COMMON_TRUNK_CERTIFICATE':
      documentName = t('form:COMMON_TRUNK_CERTIFICATE')
      break
    case 'CERTIFICATES_OF_SPECIALITIES':
      documentName = t('form:CERTIFICATES_OF_SPECIALITIES')
      break
    case 'EC1099_PIPEM_INSPECTORS':
      documentName = t('form:input-label-head-of-service')
      break
    case 'EC1102_HBS_INSPECTORS':
      documentName = t('form:EC1099_PIPEM_INSPECTORS')
      break

    case 'SAFETY_AND_HYGIENE_CERTIFICATE':
      documentName = t('form:SAFETY_AND_HYGIENE_CERTIFICATE')
      break

    case 'TRAINING_FROM_THE_LOCAL_AIRPORT_SECURITY_PROGRAM':
      documentName = t('form:TRAINING_FROM_THE_LOCAL_AIRPORT_SECURITY_PROGRAM')
      break

    case 'MRX_OPERATION_RECORD':
      documentName = t('form:MRX_OPERATION_RECORD')
      break

    case 'DMP_OPERATION_RECORD':
      documentName = t('form:DMP_OPERATION_RECORD')
      break

    case 'ETD_OPERATION_RECORD':
      documentName = t('form:ETD_OPERATION_RECORD')
      break

    case 'CTX_OPERATION_RECORD':
      documentName = t('form:CTX_OPERATION_RECORD')
      break
    case 'CCTV_OPERATION_RECORD':
      documentName = t('form:CCTV_OPERATION_RECORD')
      break
    case 'RECORD_SECURITY_SURVEILLANCE_PROPERTY_REAL_STATE':
      documentName = t('form:RECORD_SECURITY_SURVEILLANCE_PROPERTY_REAL_STATE')
      break

    case 'RECORD_IN_PERSONAL_DEFENSE':
      documentName = t('form:RECORD_IN_PERSONAL_DEFENSE')
      break

    case 'RECORD_PHYSICAL_CONDITION':
      documentName = t('form:RECORD_PHYSICAL_CONDITION')
      break

    case 'RECORD_IN_DEALING_WITH_THE_PUBLIC':
      documentName = t('form:RECORD_IN_DEALING_WITH_THE_PUBLIC')
      break

    case 'RECORD_FIRST_AID':
      documentName = t('form:RECORD_FIRST_AID')
      break

    case 'RECORD_RADIO_COMMUNICATION':
      documentName = t('form:RECORD_RADIO_COMMUNICATION')
      break

    case 'RECORD_PREPARING_REPORTS':
      documentName = t('form:RECORD_PREPARING_REPORTS')
      break

    case 'CERTIFICATE_OF_STUDIES':
      documentName = t('form:CERTIFICATE_OF_STUDIES')
      break

    case 'CURP':
      documentName = t('form:CURP')
      break

    case 'BIRTH_CERTIFICATE':
      documentName = t('form:BIRTH_CERTIFICATE')
      break

    case 'CUIP':
      documentName = t('form:CUIP')
      break

    case 'OFFICIAL_IDENTIFICATION':
      documentName = t('form:OFFICIAL_IDENTIFICATION')
      break

    case 'PROOF_OF_ADDRESS':
      documentName = t('form:PROOF_OF_ADDRESS')
      break

    case 'JOB_APPLICATION':
      documentName = t('form:JOB_APPLICATION')
      break

    case 'IMSS_REGISTRATION':
      documentName = t('form:IMSS_REGISTRATION')
      break

    default:
      documentName = t('form:IMSS_REGISTRATION')
      break
  }
  return documentName
}
