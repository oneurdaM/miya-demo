import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CSVLink } from 'react-csv'
import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import { Routes } from '@/config/routes'
import { useUsersQuery } from '@/data/users'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import UserList from '@/components/user/user-list'
import PageHeading from '@/components/common/page-heading'
import { CsvIcon } from '@/components/icons/csv-icon'
import Select from '@/components/ui/select/select'
import { UsersResponse } from '@/types/users'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { useSettingsQuery } from '@/data/settings'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Users() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const { settings } = useSettingsQuery()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, _setUserFilter] = useState<UsersResponse[]>([])
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)
  const { users, loading, error, paginatorInfo } = useUsersQuery({
    limit: 5,
    page,
    search: searchTerm,
    jobPosition: searchJob,
  })

  const router = useRouter()

  if (loading) return <Loader text="Cargando usuarios..." />

  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleChangeFilter(value: any) {
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }
  // const { settings } = useSettingsQuery()

  if (loading) return <Loader />

  const markdownContent = `
  # Términos y Condiciones de Uso

Bienvenido a nuestro servicio. Antes de continuar, te pedimos que leas detenidamente los siguientes términos y condiciones de uso. Estos términos rigen tu acceso y uso de nuestro servicio. Al acceder o utilizar el servicio, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de los términos y condiciones, no podrás acceder al servicio.

## Uso del Servicio

El acceso y uso de este servicio está sujeto a los siguientes términos:

1. **Licencia de Uso**: Se te concede una licencia limitada, no exclusiva y no transferible para acceder y utilizar el servicio únicamente con fines personales y no comerciales.

2. **Restricciones**: No podrás:

    - Modificar o realizar ingeniería inversa del servicio.
    - Reproducir, duplicar, copiar o revender cualquier parte del servicio.
    - Utilizar el servicio para cualquier propósito ilegal o no autorizado.

3. **Cuentas de Usuario**: Al registrarte en nuestro servicio, aceptas proporcionar información precisa y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña y de restringir el acceso a tu computadora. Eres responsable de todas las actividades que ocurran bajo tu cuenta.

## Limitación de Responsabilidad

En ningún caso seremos responsables por daños directos, indirectos, incidentales, especiales, consecuentes o ejemplares que surjan de o estén relacionados con tu uso del servicio. Esta limitación de responsabilidad se aplica independientemente de la teoría de responsabilidad, ya sea en contrato, agravio (incluida la negligencia), responsabilidad estricta o de otra manera, incluso si se ha informado de la posibilidad de tales daños.

## Cambios en los Términos y Condiciones

Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en cualquier momento. Si una revisión es importante, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigencia los nuevos términos. Lo que constituye un cambio material se determinará a nuestra sola discreción.

## Contacto

Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos.

---

Última actualización: [Fecha]
[texto del enlace](www.google.com)

`

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="flex w-full flex-col items-center space-y-4 md:w-3/4 md:flex-row md:space-y-0 md:ms-auto xl:w-full xl:justify-between">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading
              title={t('common:sidebar-nav-item-settings-terms-conditions')}
            />
          </div>

          {permission ? (
            <LinkButton
              href={`${Routes.terms.create}`}
              className="h-12 w-full md:w-auto md:ms-6 rounded-md"
            >
              <span>
                +
                {Object.keys(settings).length > 0
                  ? t('form:button-label-update-term')
                  : t('form:button-label-add-term')}
              </span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      <Card>
        <div className="markdown-container max-w-4xl mx-auto px-4 py-8">
          <ReactMarkdown>
            {Object.keys(settings).length > 0
              ? settings.terms
              : markdownContent}
          </ReactMarkdown>
        </div>
      </Card>
    </>
  )
}

Users.Layout = Layout

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
