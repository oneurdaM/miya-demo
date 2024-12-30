import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useRoundQueryId } from '@/data/round'
import { GetServerSideProps } from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import UserRoundTable from '@/components/round/user-round'
import Card from '@/components/common/card'
import PageHeading from '@/components/common/page-heading'
import LinkButton from '@/components/ui/link-button'

export default function UserPage() {
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { t } = useTranslation()
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)

  const { round, loading, error } = useRoundQueryId({
    id: Number(id),
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <>
        <Card className="mb-8 flex flex-col lg:flex-row justify-between lg:w-full">
          <div className="flex flex-col justify-between mb-4 md:mb-0 md:w-1/4 lg:w-full lg:flex-row lg:items-center">
            <PageHeading title="Usuarios en esta ronda" />
            <LinkButton
              href={router.asPath + '/../add'}
              className="mt-4 md:mt-0 lg:ml-auto rounded-md"
            >
              Agregar usuario
            </LinkButton>
          </div>
        </Card>

        <UserRoundTable
          rounds={
            //@ts-ignore
            round?.user_roundParticipants
          }
        />
      </>
    </>
  )
}

UserPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx)
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
      ...(await serverSideTranslations(ctx.locale ?? 'es', [
        'table',
        'common',
        'form',
      ])),
    },
  }
}
