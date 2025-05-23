/* eslint-disable @typescript-eslint/no-explicit-any */
import { BanUser } from '@/components/icons/ban-user'
import { EditIcon } from '@/components/icons/edit'
import { TrashIcon } from '@/components/icons/trash'
import { Eye } from '@/components/icons/eye-icon'
import { CheckMarkCircle } from '@/components/icons/checkmark-circle'
import { useModalAction } from '@/components/ui/modal/modal.context'
import { CloseFillIcon } from '@/components/icons/close-fill'
import { AdminIcon } from '@/components/icons/admin-icon'
import Link from 'next/link'
import { Role } from '@/types/users'
import { ChatIcon } from '../icons/chat-icon'
import FolderIcon from '../icons/folder-solid'
import router from 'next/router'
import { PlusIcon } from '../icons/plus-icon'
import PDFIcon from '../icons/pdf-solid'

type Props = {
  id: string
  deleteFile?: string | any

  editModalView?: string | any
  deleteModalView?: string | any
  editUrl?: string
  addDocuments?: string
  detailsUrl?: string
  validDocument?: string
  showMoreDocuments?: string
  isUserActive?: boolean
  userStatus?: boolean
  isShopActive?: boolean
  approveButton?: boolean
  showFile?: string
  //show contact with user
  showContact?: boolean
  showAddWalletPoints?: boolean
  changeRefundStatus?: boolean
  showMakeAdminButton?: boolean
  showReplyQuestion?: boolean
  customLocale?: string
  role?: Role
}

const ActionButtons = ({
  id,
  editModalView,
  deleteModalView,
  showFile,
  editUrl,
  detailsUrl,
  addDocuments,
  validDocument,
  userStatus = false,
  isUserActive = false,
  isShopActive,
  approveButton = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  showContact = false,
  customLocale,
  showMoreDocuments,
  deleteFile,
  role,
}: Props) => {
  const { openModal } = useModalAction()

  function handleDelete() {
    openModal(deleteModalView, id)
  }

  function handleEditModal() {
    openModal(editModalView, id)
  }

  function handleUserStatus(banned: boolean) {
    openModal('BAN_CUSTOMER', { id, banned })
  }

  function handleValidateDocument(string: any, arra: any) {}

  function handleMakeAdmin() {
    openModal('MAKE_ADMIN', { id, role })
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      //   openModal('SHOP_APPROVE_VIEW', id)
    } else {
      //   openModal('SHOP_DISAPPROVE_VIEW', id)
    }
  }

  function handleShowContact() {
    openModal('SHOW_CONTACT', id)
  }

  function handleReplyQuestion() {
    openModal('REPLY_QUESTION', id)
  }

  return (
    <div className="gap-8 inline-flex w-auto items-center">
      {showReplyQuestion && (
        <button
          onClick={handleReplyQuestion}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          Reply
        </button>
      )}
      {showMakeAdminButton && (
        <button
          onClick={handleMakeAdmin}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={'Cambiar a operador'}
        >
          <AdminIcon width={18} />
        </button>
      )}

      {deleteFile && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={'Eliminar'}
        >
          <TrashIcon width={16} />
        </button>
      )}

      {deleteModalView && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={'Eliminar'}
        >
          <TrashIcon width={16} />
        </button>
      )}
      {editModalView && (
        <button
          onClick={handleEditModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={'Editar'}
        >
          <EditIcon width={16} />
        </button>
      )}
      {approveButton &&
        (!isShopActive ? (
          <button
            onClick={() => handleShopStatus(true)}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
            title={'Aprobar'}
          >
            <CheckMarkCircle width={20} />
          </button>
        ) : (
          <button
            onClick={() => handleShopStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={'Desaprobar'}
          >
            <CloseFillIcon width={20} />
          </button>
        ))}
      {userStatus && (
        <>
          {isUserActive ? (
            <button
              onClick={() => handleUserStatus(false)}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={'Bloquear'}
            >
              <BanUser width={20} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus(true)}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={'Activar'}
            >
              <CheckMarkCircle width={20} />
            </button>
          )}
        </>
      )}
      {editUrl && (
        <Link
          href={editUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={'Editar'}
        >
          <EditIcon width={16} />
        </Link>
      )}
      {detailsUrl && (
        <Link
          href={detailsUrl}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={'Detalles'}
          locale={customLocale}
        >
          <Eye width={24} />
        </Link>
      )}

      {addDocuments && (
        <Link
          href={addDocuments}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={'Añadir documentos'}
          locale={customLocale}
        >
          <FolderIcon width={24} />
        </Link>
      )}
      {validDocument && (
        <Link
          href={validDocument}
          className=" text-base transition duration-200 hover:text-heading"
          title={'Detalles'}
          locale={customLocale}
        >
          <Eye width={24} />
        </Link>
      )}

      {showFile && (
        <Link
          href={showFile}
          target="_blank"
          className="text-base transition duration-200 hover:text-heading"
          title={'Ver pdf'}
          locale={customLocale}
        >
          <PDFIcon width={24} />
        </Link>
      )}
      {showMoreDocuments && (
        <Link
          href={showMoreDocuments}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={'Detalles'}
          locale={customLocale}
        >
          <FolderIcon width={24} />
        </Link>
      )}

      {
        // showContact - show icon to contact with user (only for admin)
        showContact && (
          <button
            onClick={handleShowContact}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          >
            <ChatIcon width={20} />
          </button>
        )
      }
    </div>
  )
}

export default ActionButtons
