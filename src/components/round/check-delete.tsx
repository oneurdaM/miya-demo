import ConfirmationCard from '../common/confirmation-card'
import {useModalAction,useModalState} from '../ui/modal/modal.context'
import {useCheckpointDeleteMutation} from '@/data/round'

const CheckpointDelete = () => {
  const {data} = useModalState()
  const {closeModal} = useModalAction()
  const {mutate: deleteCheck,isLoading} = useCheckpointDeleteMutation()

  async function handleDelete() {
    deleteCheck({id: data})
    closeModal()
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText="text-yes"
      title="Eliminar Checkpoint"
      description="Está seguro que desea eliminar este Checkpoint?"
      deleteBtnLoading={isLoading}
    />
  )
}

export default CheckpointDelete
