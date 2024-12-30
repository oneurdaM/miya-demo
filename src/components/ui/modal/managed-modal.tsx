import Modal from '@/components/ui/modal/modal'
import dynamic from 'next/dynamic'
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context'
import ComposeMessageGroupModal from '@/components/message/compose-message-group'
import JobPositionByDocumentDelete from '@/components/roles/delete-document-by-job'
import JobPositionDelete from '@/components/roles/role-delete'
import ShowCheckpointModal from '@/components/checkpoint/show-checkpoint-modal'

const BanCustomerView = dynamic(() => import('@/components/user/user-ban-view'))
const CategoryDeleteView = dynamic(
  () => import('@/components/category/category-delete-view')
)
const MakeAdminView = dynamic(() => import('@/components/user/make-admin-view'))
const ComposerMessage = dynamic(
  () => import('@/components/message/compose-message')
)
const NoteDeleteView = dynamic(
  () => import('@/components/blog/note-delete-view')
)
const AlertChangeStatus = dynamic(
  () => import('@/components/alert/alert-edit-view')
)
const NoticeDeleteView = dynamic(
  () => import('@/components/notice/notice-delete-view')
)
const SuggestionDeleteView = dynamic(
  () => import('@/components/suggestions/suggestion-delete-view')
)
const AlertDelete = dynamic(() => import('@/components/alert/alert-delete'))
const DeleteEnvironmentView = dynamic(
  () => import('@/components/environments/environment-delete-view')
)
const UserDeleteView = dynamic(
  () => import('@/components/user/user-delete-view')
)
const ShiftDeleteView = dynamic(
  () => import('@/components/shifts/shift-delete-view')
)

const ChangeStatusDocument = dynamic(
  () => import('@/components/documents/document-status-view')
)
const DeleteDocument = dynamic(
  () => import('@/components/documents/delete-document')
)
const CreateDocument = dynamic(
  () => import('@/components/documents/new-document')
)
const CreateDocumentType = dynamic(
  () => import('@/components/documents/create-document')
)

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'BAN_CUSTOMER':
      return <BanCustomerView />
    case 'MAKE_ADMIN':
      return <MakeAdminView />
    case 'COMPOSE_MESSAGE':
      return <ComposerMessage />
    case 'COMPOSE_MESSAGE_GROUP':
      return <ComposeMessageGroupModal />
    case 'LOCATE_USER':
      return <div>Locate User</div>
    case 'MODAL_DELETE_CATEGORY_VIEW':
      return <CategoryDeleteView />
    case 'DELETE_NOTE':
      return <NoteDeleteView />
    case 'CHANGE_STATUS_ALERT':
      return <AlertChangeStatus />
    case 'DELETE_ENVIRONMENT':
      return <DeleteEnvironmentView />
    case 'ALERT_DELETE':
      return <AlertDelete />
    case 'DELETE_SUGGESTION':
      return <SuggestionDeleteView />
    case 'DELETE_NOTICE':
      return <NoticeDeleteView />
    case 'DELETE_USER':
      return <UserDeleteView />
    case 'DELETE_SHIFT':
      return <ShiftDeleteView />
    case 'CHANGE_STATUS_DOCUMENT':
      return <ChangeStatusDocument />
    case 'DELETE_DOCUMENT':
      return <DeleteDocument />
    case 'CREATE_DOCUMENT':
      return <CreateDocument />
    case 'CREATE_DOCUMENT_TYPE':
      return <CreateDocumentType />
    case 'DELETE_DOCUMENT_BY_JOBPOSITION':
      return <JobPositionByDocumentDelete />
    case 'DELETE_JOBPOSITION':
      return <JobPositionDelete />
    case 'SHOW_CHECKPOINT':
      return <ShowCheckpointModal />
    default:
      return null
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState()
  const { closeModal } = useModalAction()

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  )
}

export default ManagedModal
