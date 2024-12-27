import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

import { UsersResponse } from '@/types/users'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import PageHeading from '@/components/common/page-heading'

import { useSocketContext } from '@/contexts/socket.context'
import { LATITUDE, LONGITUDE, miniSidebarInitialValue } from '@/utils/constants'
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
import { userSectorListQuery } from '@/data/analytics'

const MapTrack = dynamic(() => import('@/components/track/map-track'), {
  ssr: false,
})


const SectorListTrack = dynamic(
  () => import('@/components/track/sector-list-track'),
  { ssr: false }
)

export default function TrackUser() {
  const [searchJob, setSearchJob] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])
  const { all_users, online_users } = useSocketContext()
  const { t } = useTranslation()
  const [formattedJobposition, setFormattedJobposition] = useState([])
  const { jobposition } = useJobPositionQuery()
  const [selectedSector, setSelectedSector] = useState<any | null>(null)

  const [jobpositionFilter, setjobpositionFilter] = useState<string | null>('') 
  const [, setMiniSidebar] = useAtom(miniSidebarInitialValue);
  
  const { sector, loading, error, paginatorInfo } = userSectorListQuery({
    limit: 10,
    page:1,
    search: '',
  })

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
              sectors={sector}
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
