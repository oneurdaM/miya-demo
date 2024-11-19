export function colorBadge(status: string) {
  switch (status) {
    case 'CREATED':
      return 'bg-yellow-400'
    case 'UNDER_REVIEW':
      return 'bg-red-400'
    // Rejected Alarm
    case 'REJECTED':
      return 'bg-blue-400'
    // False Alarm
    case 'FALSE_ALARM':
      return 'bg-purple-400'
    // Solved
    case 'SOLVED':
      return 'bg-green-400'
    default:
      return 'bg-gray-400'
  }
}

export function colorBadgeDocument(status: boolean) {
  switch (status) {
    case false:
      return 'bg-yellow-400'
    case true:
      return 'bg-green-400'
    default:
      return 'bg-gray-400'
  }
}



export function colorStatusAttendances(status: string) {
  switch (status) {
    case 'DONE':
      return 'bg-green-400'
    case 'ON_SITE':
      return 'bg-blue-400'
    case 'OFF_SITE':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
}

export function colorStatusRound(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-400'; 
    case 'VERIFIED':
    case 'ACTIVE':
      return 'bg-blue-400'; 
    case 'VALID':
      return 'bg-yellow-700'; 
    case 'IN_PROGRESS':
      return 'bg-yellow-400'; 
    default:
      return 'bg-gray-400'; 
  }
}
