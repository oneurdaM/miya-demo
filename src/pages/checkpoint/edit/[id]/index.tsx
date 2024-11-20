import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import {useCheckpointByIQuery} from '@/data/round'
import {GetServerSideProps} from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import {Routes} from '@/config/routes'

import DontView from '@/components/dontView/dont-view'
import CheckpointCreate from '@/components/checkpoint/creaete-edit-checkpoint'

export default function UserPage() {
  const router = useRouter()
  const {
    query: {id},
  } = router

  const {t} = useTranslation()
  const {permissions} = getAuthCredentials()
  let permission = hasAccess(adminOnly,permissions)

  const [searchTerm,setSearchTerm] = useState('')
  const [searchJob,setSearchJob] = useState('')
  const [page,setPage] = useState(1)

  const {checkpoint,loading,error} = useCheckpointByIQuery({
    id: Number(id),
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      {permission ? (
        <>
          <CheckpointCreate initialValues={checkpoint} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

UserPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {token,permissions} = getAuthCredentials(ctx)
  if (
    !isAuthenticated({token,permissions}) ||
    !hasAccess(allowedRoles,permissions)
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
      ...(await serverSideTranslations(ctx.locale ?? 'es',[
        'table',
        'common',
        'form',
      ])),
    },
  }
}
