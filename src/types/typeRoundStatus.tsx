import { useTranslation } from 'react-i18next'

export const switchRoundStatus = (status: string) => {
  const { t } = useTranslation()

  let statusName: string
  switch (status) {
    case 'ACTIVE':
      statusName = t('form:active')
      break
    case 'IN_PROGRESS':
      statusName = t('form:in_pogress')

      break
    case 'COMPLETED':
      statusName = t('form:completed')
      break
    case 'VERIFIED':
      statusName = t('form:verified')
      break
    default:
      statusName = t('form:active')
      break
  }
  return statusName
}
