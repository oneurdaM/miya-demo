import React from 'react'

type IProps = {
  firstName: string
  lastName: string
  jobposition?: string
}
function UserJobposition(props: IProps) {
  return (
    <div className="flex w-full text-xl rounded-md text-white font-bold">
      <p className=" bg-blue-950 p-2 rounded-l-md">
        {props?.firstName + ' ' + props?.lastName}
      </p>
      <p className="bg-gray-100 text-blue-950 font-bold p-2 rounded-r-md">
        {props.jobposition}
      </p>
    </div>
  )
}

export default UserJobposition
