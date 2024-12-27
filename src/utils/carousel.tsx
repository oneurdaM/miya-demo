import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { capitalizeWords } from './functions'
import { UsersResponse } from '@/types/users'
import { useSocketContext } from '@/contexts/socket.context'
import Avatar from '@/components/common/avatar'
import { siteSettings } from '@/settings/site.settings'

const CarouselComponent = ({ users, jobPositionFilter }: any) => {
  const router = useRouter()
  const { all_users } = useSocketContext()
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }

  const selectUser = (id: number) => {
    console.log('id selected', id)
    router.push({
      pathname: '/track/' + id,
    })
  }

  useEffect(() => {
    if (jobPositionFilter) {
      const filteredUsers = all_users?.filter((user) => {
        return capitalizeWords(user?.jobPosition?.name) === capitalizeWords(jobPositionFilter)
      })

      if (filteredUsers) setUserFilter(filteredUsers)
    } else {
      setUserFilter([])
    }
  }, [jobPositionFilter, all_users])

  return (
    <div>
   <Carousel responsive={responsive} className="mx-32">
  {(userFilter.length > 0 ? userFilter : users).map(
    (element: any, index: number) => (
      <div
        onClick={() => {
          selectUser(element.id)
        }}
        className={`flex bg-white items-center w-[12rem] py-4 rounded-md overflow-hidden shadow-md hover:cursor-pointer hover:bg-slate-300 transition-colors duration-200 ease-in-out`}
        key={index}
      >

        <div className="flex items-center justify-center pl-1 h-14  rounded-full">
          <div className="relative w-10 h-10">

            {element.image ? (

               <Image
              src={element.image}
              alt={`Imagen de ${element.name}`}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            ) :
            
            (
              <Avatar
              src={siteSettings?.avatar?.placeholder}
           
              name={element?.firstName as string}
             
            />

            )}
           
          </div>
        </div>
        <div className="flex flex-col flex-grow  rounded-md mx-1 border-2 p-0.5">
          <div className="flex items-center mb-1 flex-wrap">
            <div
              className={`${
                element.online ? 'bg-green-500' : 'bg-gray-500'
              } rounded-full h-3 w-3`}
            ></div>
            <span className="text-xs ml-2">
              {element.online ? 'En línea' : 'Desconectado'}
            </span>
          </div>
          <h3 className="text-xs font-semibold flex">
            <p className='mr-1' >

            {element.firstName}

            </p>
            <p>{element.lastName}</p>
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1 overflow-hidden">
            {element?.jobPosition?.name}
          </p>
        </div>
      </div>
    )
  )}
</Carousel>

    </div>
  )
}

export default CarouselComponent
