import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import Pagination from '../ui/pagination'
import { MappedPaginatorInfo } from '@/types'
import { AlignType, Table } from '@/components/ui/table'
import TitleWithSort from '../ui/title-with-sort'

type BiometricsListProps = {
  biometrics: any
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (page: number) => void
}

const BiometricsList = ({
  biometrics,
  paginatorInfo,
  onPagination,
}: BiometricsListProps) => {
  const { t } = useTranslation()
  // const {mutate: update,isLoading} = useUpdateBiometricMutation();
  function changeStatus(biometric: any, status: boolean) {
    // update({
    // 	id: biometric.id.toString(),
    // 	is_approved: status,
    // })
  }

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      width: 64,
    },
    {
      title: 'Imágen',
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      width: 74,
      render: (image: string) => (
        <Image
          src={image ?? '/images/placeholder.png'}
          alt="artile"
          className="overflow-hidden rounded"
          width={42}
          height={42}
        />
      ),
    },
    {
      title: <TitleWithSort title="Título" ascending={true} isActive={false} />,
      dataIndex: 'title',
      key: 'title',
      align: 'center' as AlignType,
      width: 170,
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as AlignType,
    },
    {
      title: 'Aprobado',
      dataIndex: 'is_approved',
      key: 'is_approved',
      align: 'center' as AlignType,
      width: 100,
      // render: (is_approved: boolean,biometric: any) => (
      // 	<Switch
      // 		checkedChildren={<CheckCircleFilled />}
      // 		unCheckedChildren={<CloseCircleFilled />}
      // 		checked={is_approved}
      // 		onChange={() => changeStatus(biometric,!is_approved)}
      // 	/>
      // ),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center' as AlignType,
      width: 100,
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          rowKey="id"
          scroll={{ x: 900 }}
          columns={columns}
          emptyText="No hay biometrias creadas"
          data={[]}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  )
}

export default BiometricsList
