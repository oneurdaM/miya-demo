import { AlignType } from 'rc-table/lib/interface'
import { Table } from '../ui/table'
import ActionButtons from '../ui/action-buttons'
import { useRouter } from 'next/router'
import { NoDataFound } from '../icons/no-data-found'
import Button from '../ui/button'
import Select from '../ui/select/select'
import Card from '../common/card'
import Description from '../ui/description'
import { useTranslation } from 'react-i18next'
import { useDocumentTypeQuery } from '@/data/documents_type'
import { capitalizeWords } from '@/utils/functions'
import { useState } from 'react'
import { useAddDocumentsToJobposition } from '@/data/job-position'

type Documents = {
  documentos: any[]
  title: string
}

const DocumentTableRole = ({ documentos, title }: Documents) => {
  const [selectedDocuments, setSelectedDocuments] = useState([])

  // Manejar el cambio en la selección
  const handleChange = (selectedOptions: any) => {
    setSelectedDocuments(selectedOptions)
  }

  const router = useRouter()

  const {
    query: { id },
  } = router

  const { t } = useTranslation()

  const { mutate: create, isLoading: createLoading } =
    useAddDocumentsToJobposition()

  const { documents, loading, error, paginatorInfo } = useDocumentTypeQuery({
    limit: 5,
    page: 1,
    search: '',
  })
  const columns: any = [
    {
      title: 'Tipo de documento',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as AlignType,
      render: (text: string) => (
        <div>
          <>{text !== undefined ? text : '----------------'}</>
        </div>
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'id', //id Document
      key: 'id',
      align: 'center' as AlignType,
      render: (id: any, documents: any, index: any) => (
        <>
          <ActionButtons
            id={documents.id}
            deleteModalView={'DELETE_DOCUMENT_BY_JOBPOSITION'}
          />
        </>
      ),
    },
  ]

  function handleBack() {
    router.back()
  }

  const formattedDocuments = documents?.map((doc) => ({
    label: capitalizeWords(doc.name),
    value: doc.id,
  }))

  function addDocuments() {
    //@ts-ignore
    const documentTypeIds = selectedDocuments.map((option) => option.value)

    const body = {
      jobpositionId: Number(id),
      documentTypeIds: documentTypeIds,
    }
    create(body)
  }

  return (
    <>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={'Tipos de documentos a los roles'}
          details={
            'Aqui puedes agregar todos los documentos necesarios para el rol correspondiente.'
          }
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Select
            isMulti
            options={formattedDocuments}
            placeholder="Selecciona los documentos"
            value={selectedDocuments} // Muestra los documentos seleccionados
            onChange={handleChange} // Maneja el cambio de selección
          />
          <div className="flex justify-end mt-4">
            <Button onClick={addDocuments}>Agregar</Button>
          </div>
        </Card>
      </div>
      <div className="overflow-hidden rounded shadow">
        <h3 className="border-b border-border-200 bg-light px-4 py-3 text-center font-semibold text-heading">
          {title}
        </h3>

        <Table
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading"></div>
              <p className="text-[13px]"></p>
            </div>
          )}
          rowKey={'id'}
          data={documentos}
          scroll={{ x: 1000 }}
        />
      </div>

      <div className="w-full text-end my-3">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>
      </div>
    </>
  )
}

export default DocumentTableRole
