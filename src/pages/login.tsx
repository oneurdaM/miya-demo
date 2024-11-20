import {useTranslation} from 'next-i18next'
import type {GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {getAuthCredentials,isAuthenticated} from '@/utils/auth-utils'

import {Routes} from '@/config/routes'
import AuthPageLayout from '@/components/layout/auth-layout'
import LoginForm from '@/components/auth/login-form'
import Button from '@/components/ui/button'
import FaceRecognitionIcon from '@/components/icons/face-recognition'

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale!,['common','form'])),
  },
})

export default function LoginPage() {
  const router = useRouter()
  const {token,permissions} = getAuthCredentials()
  if (isAuthenticated({token,permissions})) {
    router.replace(Routes.dashboard)
  }
  const {t} = useTranslation('common')

  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base italic text-body">
        {t('admin-login-title')}
      </h3>
      <LoginForm />

      {/* Or */}
      <div className="flex items-center justify-center mt-6">
        <div className="w-1/3 border-t border-border-base" />
        <span className="mx-4 text-muted">{t('text-or')}</span>
        <div className="w-1/3 border-t border-border-base" />
      </div>

      {/* Face recognition button */}
      <div className="flex flex-col items-center justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => router.push(Routes.biometrics)}
        >
          <FaceRecognitionIcon className="w-6 h-6 mr-3" />
          {t('navigate-face-recognition')}
        </Button>
      </div>
    </AuthPageLayout>
  )
}
