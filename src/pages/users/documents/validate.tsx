import {GetServerSideProps} from 'next'
import {useTranslation} from 'react-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import {Routes} from '@/config/routes'

import Layout from '@/components/layout/admin'
import ValidateDocumentForm from '@/components/auth/validate-document-form'
import router from 'next/router'
import {documentByIdQuery} from '@/data/user'

export default function ValidateDocument() {
  const {t} = useTranslation()
  const {permissions} = getAuthCredentials()
  let permission = hasAccess(adminOnly,permissions)

  const {
    query: {idDocument},
  } = router
  const {document,loading,error} = documentByIdQuery({
    id: Number(idDocument),
  })

  console.log(document)

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-validate-document')}
        </h1>
      </div>
      {permission ? (
        <ValidateDocumentForm
        onClose={()=>{}}
          initialValues={document}
          // valid={document?.valid}
          id={idDocument}
        />
      ) : null}
    </>
  )
}

ValidateDocument.Layout = Layout

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
