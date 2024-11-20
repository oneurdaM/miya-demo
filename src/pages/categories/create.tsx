import CategoryForm from '@/components/category/category-form'
import DontView from '@/components/dontView/dont-view'
import Layout from '@/components/layout/admin'
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function CreateCategory() {
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)
  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              Crear Categoría
            </h1>
          </div>

          <CategoryForm />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateCategory.Layout = Layout

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
})
