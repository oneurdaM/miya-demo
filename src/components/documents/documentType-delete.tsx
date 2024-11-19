import { useAlertDeleteMutation } from '@/data/alert'
import ConfirmationCard from '../common/confirmation-card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { useDocumentTypeDeleteMutation } from '@/data/documents_type'

const DocumentTypeDelete = () => {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { mutate: deleteDocumentType, isLoading } =
    useDocumentTypeDeleteMutation()

  async function handleDelete() {
    deleteDocumentType({ id: data })
    closeModal()
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText="text-yes"
      title="Eliminar tipo de documento"
      description="Está seguro que desea eliminar este tipo de documento?"
      deleteBtnLoading={isLoading}
    />
  )
}

export default DocumentTypeDelete
