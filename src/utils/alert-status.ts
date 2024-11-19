import {AlertStatus} from '@/types/alerts'

export function getAlertStatus(status: AlertStatus ) {
  switch (status) {
    case AlertStatus.Created:
      return 'form:status-alarm-created'
    case AlertStatus.UnderReview:
      return 'form:status-alarm-under-review'
    case AlertStatus.Solved:
      return 'form:status-alarm-solved'
    case AlertStatus.Rejected:
      return 'form:status-alarm-rejected'
    case AlertStatus.FalseAlarm:
      return 'form:status-false_alarm'
  }
}
