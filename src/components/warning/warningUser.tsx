import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  text: string
  route: string
}

export const WarningUser = (props: Props) => {
  const router = useRouter()

  function redirecTo() {
    router.push('../' + props.route + '/create')
  }
  return (
    <div
      onClick={redirecTo}
      className=" mx-10 rounded-md border-2 text-center bg-yellow-500/20 border-yellow-500/40 shadow-2xl text-gray-700  p-4  hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-300"
    >
      {props.text}
    </div>
  )
}
