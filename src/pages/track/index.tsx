import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

import Select from '@/components/ui/select/select'
import { UsersResponse } from '@/types/users'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import PageHeading from '@/components/common/page-heading'

import { useSocketContext } from '@/contexts/socket.context'
import { LATITUDE, LONGITUDE, miniSidebarInitialValue } from '@/utils/constants'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { capitalizeWords } from '@/utils/functions'
import { useJobPositionQuery } from '@/data/job-position'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'
import CarouselComponent from '@/utils/carousel'
import { useAtom } from 'jotai'

const MapTrack = dynamic(() => import('@/components/track/map-track'), {
  ssr: false,
})
const UsersListTrack = dynamic(
  () => import('@/components/track/user-list-track'),
  { ssr: false }
)

const SectorListTrack = dynamic(
  () => import('@/components/track/sector-list-track'),
  { ssr: false }
)

export default function TrackUser() {
  const router = useRouter()
  const [searchJob, setSearchJob] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])
  const { all_users, online_users } = useSocketContext()
  const { t } = useTranslation()
  const [formattedJobposition, setFormattedJobposition] = useState([])
  const { jobposition } = useJobPositionQuery()
  const [selectedSector, setSelectedSector] = useState<any | null>(null)

  const [jobpositionFilter, setjobpositionFilter] = useState<string | null>('') // Define el estado del prop
  const [, setMiniSidebar] = useAtom(miniSidebarInitialValue);

  const sector = [
    {
      id: 1,
      name: 'Sector 1',
      color: 'bg-blue-500/30',
      location: { lat: 23.16333, lng: -109.71756 },
      userCount: 10,
      users:[
        {
          name:"Sebas"
        },
        {
          name:"Sebas"
        },
        {
          name:"Sebas"
        },
        {
          name:"Sebas"
        }
      ]
    },

    {
      id: 2,
      name: 'Sector 2',
      color: 'bg-green-500/40',
      userCount: 10,
      location: { lat: 23.16319, lng: -109.71756 },
    },
    {
      id: 3,
      name: 'Sector 3',
      color: 'bg-blue-500/30',
      userCount: 10,
      location: { lat: 23.16333, lng: -109.71756 },
    },

    {
      id: 4,
      name: 'Sector 4',
      color: 'bg-green-500/40',
      userCount: 10,
      location: { lat: 23.16319, lng: -109.71756 },
    },
    {
      id: 5,
      name: 'Sector 5',
      color: 'bg-blue-500/30',
      userCount: 10,
      location: { lat: 23.16333, lng: -109.71756 },
    },

    {
      id: 6,
      name: 'Sector 6',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
      userCount: 10,

    },

    {
      id: 6,
      name: 'Sector 6',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
      userCount: 10,

    },

    {
      id: 6,
      name: 'Sector 6',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
      userCount: 10,

    },
  ]

  useEffect(() => {
    if (Array.isArray(jobposition)) {
      const formatted: any = jobposition.map((doc: any) => ({
        label: capitalizeWords(doc.name),
        value: doc.id,
      }))
      setFormattedJobposition(formatted)
    }
  }, [jobposition])

  useEffect(() => {
    if (searchJob) {
      const filteredUsers = all_users?.filter((user) => {
        return user?.jobPosition?.name === searchJob
      })

      if (filteredUsers) setUserFilter(filteredUsers)
    } else {
      setUserFilter([])
    }
  }, [searchJob, all_users])

  const selectUser = () => {
    router.push({
      pathname: '/track',
    })
  }

  function handleSelect(value: any) {
    setSearchJob(value ? value.label : null)
  }

  useEffect(() => {
    setMiniSidebar(true )
  }, [setMiniSidebar]); 


  return (
    <>
      <Card className="mb-flex flex-col relative">
        <div className="flex w-full flex-col items-center md:flex-row mb-4">
          <div className="md:mb-0 w-full">
            <PageHeading title={t('form:input-label-track-users')} />
          </div>
        </div>

        <div className="lg:flex ">
          <div className="lg:w-3/4">
            <MapTrack
              userOnline={online_users}
              latitude={LATITUDE}
              longitude={LONGITUDE}
              className="lg:col-span-1 lg:col-start-1 lg:row-start-2 2xl:col-span-5 2xl:col-start-auto 2xl:row-start-auto 2xl:me-20"
              title="form:input-label-track-users"
              sectores={selectedSector}
              jobpositionFilter={setjobpositionFilter}
            />
          </div>

          <div className="absolute lg:top-[77%] top-[45%] left-0 lg:w-[69.7%] w-full p-4 z-10">
            <CarouselComponent users={all_users} jobPositionFilter={jobpositionFilter} />
          </div>

          <div className="lg:w-1/4 mt-12 h-full p-2 rounded-md border">
            <SectorListTrack
              title={
                <div className="flex items-center justify-between">
                  <span>Sectores</span>
                </div>
              }
              className="lg:col-span-1 lg:col-start-2 lg:row-start-2 w-full 2xl:col-span-4 2xl:col-start-auto 2xl:row-start-auto"
              users={sector}
              onSelect={(sector) => {
                setSelectedSector(sector)
              }}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

TrackUser.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx)
  const locale = ctx.locale || 'es'
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: Routes.login,
        permanent: false,
      },
    }
  }
  return {
    props: {
      userPermissions: permissions,
      ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
  }
}
