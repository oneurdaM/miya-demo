import { Router, useRouter } from 'next/router'
import React from 'react'

type Props = {
  text: string
  route: string
}

export const WarningCompoenent = (props: Props) => {
  const router = useRouter()

  function redirecTo() {
    router.push('../' + props.route + '/create')
  }
  return (
    <div
      onClick={redirecTo}
      className="absolute lg:top-32 top-20 left-14 lg:left-1/2 sm:left-48 border-2 px-4 sm:px-4 lg:py-3 sm:text-lg sm:py-2 text-gray-700 rounded-md bg-yellow-500/20 border-yellow-500/40 shadow-2xl hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-300"
    >
      {props.text}
    </div>
  )
}
