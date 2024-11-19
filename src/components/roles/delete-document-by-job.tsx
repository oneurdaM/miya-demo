import { useAlertDeleteMutation } from '@/data/alert'
import ConfirmationCard from '../common/confirmation-card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import {
  useJobpositionDeleteMutation,
  useJobpositionUnlinkDocumentMutation,
} from '@/data/job-position'
import { useRouter } from 'next/router'

const JobPositionByDocumentDelete = () => {
  const { data } = useModalState()

  const router = useRouter()
  const {
    query: { id },
  } = router

  const { closeModal } = useModalAction()
  const { mutate: deleteJobPosition, isLoading } =
    useJobpositionUnlinkDocumentMutation()

  async function handleDelete() {
    deleteJobPosition({ id: Number(id), documentId: data })
    closeModal()
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText="text-yes"
      title="Eliminar documento de la posición"
      description="Está seguro que desea eliminar este documento?"
      deleteBtnLoading={isLoading}
    />
  )
}

export default JobPositionByDocumentDelete
