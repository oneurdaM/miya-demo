import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

import Select from '@/components/ui/select/select'
import { UsersResponse } from '@/types/users'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import PageHeading from '@/components/common/page-heading'

import { useSocketContext } from '@/contexts/socket.context'
import { LATITUDE, LONGITUDE } from '@/utils/constants'
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

  const sector = [
    {
      id: 1,
      name: 'Sector 1',
      color: 'bg-blue-500/30',
      location: { lat: 23.16333, lng: -109.71756 },
    },

    {
      id: 2,
      name: 'Sector 2',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
    
    },
    {
      id: 3,
      name: 'Sector 3',
      color: 'bg-blue-500/30',
      location: { lat: 23.16333, lng: -109.71756 },
  
    },

    {
      id: 4,
      name: 'Sector 4',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
    
    },
    {
      id: 5,
      name: 'Sector 5',
      color: 'bg-blue-500/30',
      location: { lat: 23.16333, lng: -109.71756 },
    
    },

    {
      id: 6,
      name: 'Sector 6',
      color: 'bg-green-500/40',
      location: { lat: 23.16319, lng: -109.71756 },
    
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
        return user?.jobPosition?.name === searchJob; 
      });
  
      if (filteredUsers) setUserFilter(filteredUsers);
    } else {
      setUserFilter([]);
    }
  }, [searchJob, all_users]);
  

  const selectUser = () => {
    router.push({
      pathname: '/track',
    })
  }

  function handleSelect(value: any) {
    setSearchJob(value ? value.label : null)
  }

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row mb-10">
          <div className="md:mb-0 w-full">
            <PageHeading title={t('form:input-label-track-users')} />
          </div>
          <div className="w-1/2"></div>
        </div>

        <div className="block lg:flex">
          <div className="md:w-11/12">
            <MapTrack
              userOnline={online_users}
              latitude={LATITUDE}
              longitude={LONGITUDE}
              className="lg:col-span-1 lg:col-start-1 lg:row-start-2 2xl:col-span-5 2xl:col-start-auto 2xl:row-start-auto 2xl:me-20"
              title="form:input-label-track-users"
              sectores={selectedSector}
            />
          </div>
          <div className="mt-[60px] lg:w-1/2">
            <div className="flex gap-3 items-center">
              <button
                className="w-full md:w-auto md:ms-6 bg-[#002549] py-2 px-2 rounded-md text-white"
                onClick={selectUser}
              >
                <p>{t('form:input-label-view-all')}</p>
              </button>

              <Select
                getOptionValue={(option: any) => option.value}
                getOptionLabel={(option: any) => option.label}
                options={formattedJobposition ?? []}
                isMulti={false}
                className="w-1/2"
                isClearable
                onChange={handleSelect}
              />
            </div>

            <UsersListTrack
              title={
                <div className="flex items-center justify-between">
                  <span>{t('common:users')}</span>
                  <div className="flex">
                    <div className="bg-green-500 rounded-full h-4 w-4"></div>
                    <span className="text-xs ml-2">En línea</span>
                  </div>
                </div>
              }
              className="lg:col-span-1 lg:col-start-2 lg:row-start-2 w-full 2xl:col-span-4 2xl:col-start-auto 2xl:row-start-auto"
              users={userFilter.length > 0 ? userFilter : all_users} // Filtrar por puesto si hay selección
            />
          </div>
        </div>

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
