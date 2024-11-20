import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/app'
import ChangePasswordForm from '@/components/auth/change-password-form'


export default function ProfilePage() {

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Actualiza tu perfil
        </h1>
      </div>
      <ChangePasswordForm />
    </>
  )
}

ProfilePage.Layout = Layout

export const getStaticProps = async ({locale}: any) => ({
  props: {
    ...(await serverSideTranslations(locale,['form','common'])),
  },
})
