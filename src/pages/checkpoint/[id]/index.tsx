import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ProfileUpdateOrCreateForm from '@/components/auth/profile-update-or-create-form'
import AlertListSmall from '@/components/alert/alert-list-small'
import Layout from '@/components/layout/admin'
import ChatTable from '@/components/ui/chat-table'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useUserQuery } from '@/data/user'
import { useCheckpointByIdRoudQuery } from '@/data/round'
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
import CreateRound from '@/components/round/create-round'
import EditRound from '@/components/round/edit-round'
import { DontAllowed } from '@/components/icons/dont-allowed'
import DontView from '@/components/dontView/dont-view'
import CheckpointList from '@/components/round/table-checkpoint'
import Button from '@/components/ui/button'
import PageHeading from '@/components/common/page-heading'
import LinkButton from '@/components/ui/link-button'
import Card from '@/components/common/card'

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

  const { checkpoint, loading, error } = useCheckpointByIdRoudQuery({
    id: Number(id),
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      {permission ? (
        <>
          <Card className="mb-8 flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0 md:w-1/4">
              <PageHeading title={'Checkpont de esta ronda'} />
            </div>

            <LinkButton href={'create?id=' + id}>
              <span>+ Agregar Checkpoint</span>
            </LinkButton>
          </Card>
          <CheckpointList checkpoint={checkpoint} />
        </>
      ) : (
        <DontView />
      )}
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
