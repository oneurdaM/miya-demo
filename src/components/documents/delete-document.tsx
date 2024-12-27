import ConfirmationCard from '@/components/common/confirmation-card'
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context'
import { useDeleteDocumentMutation } from '@/data/documents'

const DeleteDocument = () => {
  const { data: modalData } = useModalState()
  const { closeModal } = useModalAction()
  const { mutate: deleteDoc, isLoading: loading } = useDeleteDocumentMutation()

  function handleDelete() {
    deleteDoc(modalData)
    closeModal()
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      deleteBtnLoading={loading}
      title="Estás seguro de eliminar este documento?"
      description="Esta acción no se puede deshacer. Esta eliminará permanentemente el documento."
      deleteBtnText="Eliminar"
      onDelete={handleDelete}
    />
  )
}

export default DeleteDocument
