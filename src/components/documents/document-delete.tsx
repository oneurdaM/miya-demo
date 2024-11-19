import { useAlertDeleteMutation } from '@/data/alert'
import ConfirmationCard from '../common/confirmation-card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { useDocumentDeleteMutation } from '@/data/documents'

const DocumentDelete = () => {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { mutate: deleteDocument, isLoading } = useDocumentDeleteMutation()

  async function handleDelete() {
    deleteDocument({ id: data })
    closeModal()
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText="text-yes"
      title="Eliminar documento"
      description="Está seguro que desea eliminar este archivo?"
      deleteBtnLoading={isLoading}
    />
  )
}

export default DocumentDelete
