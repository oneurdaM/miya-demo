import React, { useState, useEffect } from 'react'
import { format, subHours } from 'date-fns'

const Clock = () => {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Restar 2 horas a la hora actual
  const adjustedDateTime = subHours(dateTime, 1)

  const formattedDate = format(adjustedDateTime, 'yyyy-MM-dd')
  const formattedTime = format(adjustedDateTime, 'HH:mm:ss')

  return (
    <div className="flex">
      <p className="text-gray-900">{formattedDate}</p>
      <p className="mx-2 text-gray-700">{formattedTime}</p>
    </div>
  )
}

export default Clock
