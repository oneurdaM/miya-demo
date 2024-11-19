import { useAlertDeleteMutation } from '@/data/alert'
import ConfirmationCard from '../common/confirmation-card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { useJobpositionDeleteMutation } from '@/data/job-position'

const JobPositionDelete = () => {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { mutate: deleteJobPosition, isLoading } =
    useJobpositionDeleteMutation()

  async function handleDelete() {
    deleteJobPosition({ id: data })
    closeModal()
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText="text-yes"
      title="Eliminar posición"
      description="Está seguro que desea eliminar esta posición?"
      deleteBtnLoading={isLoading}
    />
  )
}

export default JobPositionDelete
