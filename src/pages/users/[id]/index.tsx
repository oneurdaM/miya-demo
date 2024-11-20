import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ProfileUpdateOrCreateForm from '@/components/auth/profile-update-or-create-form'
import AlertListSmall from '@/components/alert/alert-list-small'
import Layout from '@/components/layout/admin'
import ChatTable from '@/components/ui/chat-table'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useUserByIdWithouTrackingQuery, useUserQuery } from '@/data/user'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'
import DontView from '@/components/dontView/dont-view'

export default function UserPage() {
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { userById, loading, error } = useUserByIdWithouTrackingQuery({
    id: Number(id),
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      {permission ? (
        <>
          <div className="mb-10 flex w-full flex-wrap space-y-6 rtl:space-x-reverse xl:flex-nowrap xl:space-x-5 xl:space-y-0">
            <div className="w-full xl:w-1/2">
              <AlertListSmall
                title="Alertas creadas"
                alerts={userById?.alerts}
              />
            </div>

            <div className="w-full xl:w-1/2">
              {
                <ChatTable
                  title="Conversaciones"
                  messages={userById?.conversations ?? []}
                />
              }
            </div>
          </div>
          <ProfileUpdateOrCreateForm initialValues={userById} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

UserPage.Layout = Layout

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
})
