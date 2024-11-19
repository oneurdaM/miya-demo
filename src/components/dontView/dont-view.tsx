import React from 'react'
import {DontAllowed} from '../icons/dont-allowed'


const DontView = () => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="absolute top-1/2 text-center lg:text-4xl text-gray-500 border-2 p-3 rounded-md">
        <span>No cuentas con los permisos para esta función</span>
      </div>
      <div className="flex items-center justify-center">
        <DontAllowed width="400" height="400" />
      </div>
    </div>
  )
}

export default DontView
