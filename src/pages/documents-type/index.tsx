import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import DocumentTable from '@/components/ui/document-table'
import PageHeading from '@/components/common/page-heading'
import {useTranslation} from 'react-i18next'
import {userDocumentsQuery} from '@/data/users'
import {useState} from 'react'
import Search from '@/components/common/search'
import {useModalAction} from '@/components/ui/modal/modal.context'
import Button from '@/components/ui/button'
import {ArrowUp} from '@/components/icons/arrow-up'
import { Routes } from '@/config/routes'
import { useRouter } from 'next/router'
import { ArrowDown } from '@/components/icons/arrow-down'
import DocumentTableType from '@/components/ui/document-type-table'
import { useDocumentTypesQuery } from '@/data/documents'

export default function UserPage() {
  const {t} = useTranslation()
  const {openModal} = useModalAction();
  const [page,setPage] = useState(1)
  const [searchTerm,setSearchTerm] = useState('')

  const router = useRouter()
  const { documentTypes, paginatorInfo, loading, error} = useDocumentTypesQuery();



  function handlePagination(current: number) {
    setPage(current)
  }

  function handleSearch({searchText}: {searchText: string}) {
    setSearchTerm(searchText)
    setPage(1)
  }


  const handleCreateDocument = () => {
    openModal('CREATE_DOCUMENT');
  };

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  function create (){
    // router.push(Routes.documents.create)
    openModal('CREATE_DOCUMENT_TYPE');

  }

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap space-y-6 ">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-documents')} />
        </div>
        <div className="flex w-full flex-col items-center space-y-4 md:w-3/4 md:flex-row md:space-y-0 md:ms-auto xl:w-3/4">
          <Search onSearch={handleSearch} />

          <Button onClick={create} size="medium" className='ml-2 bg-primaryColor text-white rounded-[7px] p-2 px-4 text-sm font-medium'>
            Tipo de documento
            <ArrowDown className='ml-2' />
          </Button>
        </div>

        <div className="w-full">
          <DocumentTableType
            title="Documentos"
            documents={documentTypes}
            paginatorInfo={paginatorInfo}
            onPagination={handlePagination}
          />
        </div>
      </div>
    </>
  )
}

UserPage.Layout = Layout

export const getServerSideProps = async ({locale}: any) => ({
  props: {
    ...(await serverSideTranslations(locale,['form','common'])),
  },
})
