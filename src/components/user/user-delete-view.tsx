import { useDeleteUserMutation } from '@/data/user'
import ConfirmationCard from '../common/confirmation-card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'

const UserDeleteView = () => {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  const { mutate: deleteUser, isLoading: loading } = useDeleteUserMutation()
  function handleDelete() {
    try {
      deleteUser({
        id: data,
      })
      closeModal()
    } catch (error) {
      closeModal()
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
      cancelBtnLoading={loading}
    />
  )
}

export default UserDeleteView
