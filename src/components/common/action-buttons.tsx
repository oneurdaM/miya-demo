/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'

import {BanUser} from '@/components/icons/ban-user'
import {EditIcon} from '@/components/icons/edit'
import {TrashIcon} from '@/components/icons/trash'
import {Eye} from '@/components/icons/eye-icon'
import {CheckMarkCircle} from '@/components/icons/checkmark-circle'
import {useModalAction} from '@/components/ui/modal/modal.context'
import {CloseFillIcon} from '@/components/icons/close-fill'
import {AdminIcon} from '@/components/icons/admin-icon'
import {ChatIcon} from '@/components/icons/sidebar'
import {CsvIcon} from '@/components/icons/csv-icon'
import FolderIcon from '@/components/icons/folder-solid'
import {CheckMark} from '@/components/icons/checkmark'
import {AvatarIcon} from '@/components/icons/avatar-icon'
import {SaveIcon} from '@/components/icons/save'

import {Role} from '@/types/users'

type CSV = {
  id: string
  isEnable: boolean
}

type Props = {
  id: string
  showRounds?: string
  showCheckpoints?: string | any
  showUserRound?: string | any
  editModalView?: string | any
  deleteModalView?: string | any
  editUrl?: string
  detailsUrl?: string
  addDocumentUser?: string
  isUserActive?: boolean
  isUserActiveAdmin?: boolean
  userStatus?: boolean
  userStatusAdmin?: boolean
  isShopActive?: boolean
  approveButton?: boolean
  showContact?: boolean
  changeRefundStatus?: boolean
  showMakeAdminButton?: boolean
  showReplyQuestion?: boolean
  customLocale?: string
  role?: Role
  previewUrl?: string
  enablePreviewMode?: boolean
  exportCsv?: CSV
  showDocuments?: string
}

const ActionButtons = ({
  id,
  showRounds,
  showUserRound,
  editModalView,
  deleteModalView,
  editUrl,
  detailsUrl,
  userStatus = false,
  userStatusAdmin = false,
  isUserActive = false,
  isUserActiveAdmin = false,
  isShopActive,
  approveButton = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  showContact = false,
  showCheckpoints,
  customLocale,
  addDocumentUser,
  role,
  exportCsv,
  showDocuments,
}: Props) => {
  const {openModal} = useModalAction()

  function handleDelete() {
    openModal(deleteModalView,id)
  }

  function handleExportCsv() { }

  function handleEditModal() {
    openModal(editModalView,id)
  }

  function handleShowCheckpoinstModal() {
    openModal(showCheckpoints,id)
  }


  function handleUserStatus(banned: boolean) {
    openModal('BAN_CUSTOMER',{id,banned})
  }

  function handleUserStatusAdmin() {
  }

  function handleMakeAdmin() {
    openModal('MAKE_ADMIN',{id,role})
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      //   openModal('SHOP_APPROVE_VIEW', id)
    } else {
      //   openModal('SHOP_DISAPPROVE_VIEW', id)
    }
  }

  function handleShowContact() {
    openModal('SHOW_CONTACT',id)
  }

  function handleReplyQuestion() {
    openModal('REPLY_QUESTION',id)
  }

  return (
    <div className="inline-flex items-center w-auto gap-3">
      {exportCsv?.isEnable && (
        <button
          onClick={() => handleExportCsv()}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          <CsvIcon width={20} />
        </button>
      )}
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

      {addDocumentUser && (
        <Link
          href={addDocumentUser}
          className="text-base transition duration-200 hover:text-heading"
          title={'Añadir documentos'}
        >
          <SaveIcon width={25} />
        </Link>
      )}

      {deleteModalView && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={'Eliminar'}
        >
          <TrashIcon width={14} />
        </button>
      )}
      {editModalView && (
        <button
          onClick={handleEditModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={'Editar'}
        >
          <EditIcon width={18} />
        </button>
      )}
      {approveButton &&
        (!isShopActive ? (
          <button
            onClick={() => handleShopStatus(true)}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
            title={'Aprobar'}
          >
            <CheckMarkCircle width={18} />
          </button>
        ) : (
          <button
            onClick={() => handleShopStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={'Desaprobar'}
          >
            <CloseFillIcon width={18} />
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
              <BanUser width={18} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus(true)}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={'Activar'}
            >
              <CheckMarkCircle width={18} />
            </button>
          )}
        </>
      )}
      {userStatusAdmin && (
        <>
          {isUserActiveAdmin ? (
            <button
              onClick={() => handleUserStatusAdmin()}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={'Bloquear'}
            >
              <BanUser width={18} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatusAdmin()}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={'Activar'}
            >
              <CheckMarkCircle width={18} />
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
          <EditIcon width={18} />
        </Link>
      )}
      {showRounds && (
        <Link
          href={showRounds}
          className="text-base transition duration-200 hover:text-heading"
          title={'Rondas'}
        >
          <CheckMark width={18} />
        </Link>
      )}

      {showCheckpoints && (
        <button
          onClick={handleShowCheckpoinstModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={'Ver'}
        >
          <CheckMark width={18} />
        </button>
      )}
      {detailsUrl && (
        <Link
          href={detailsUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={'Detalles'}
          locale={customLocale}
        >
          <Eye width={18} />
        </Link>
      )}
      {showDocuments && (
        <Link
          href={showDocuments}
          className="text-base transition duration-200 hover:text-heading"
          title={'Documentos'}
          locale={customLocale}
        >
          <FolderIcon width={18} />
        </Link>
      )}

      {showUserRound && (
        // <button
        //   onClick={handleshowUserROund}
        //   className="text-base transition duration-200 hover:text-heading"
        //   title={'Usuarios'}
        // >
        //   <AvatarIcon width={18} />
        // </button>

        <Link
          href={showUserRound}
          className="text-base transition duration-200 hover:text-heading"
          title={'Usuarios en ronda'}
          locale={customLocale}
        >
          <AvatarIcon width={18} />
        </Link>
      )}
      {
        // showContact - show icon to contact with user (only for admin)
        showContact && (
          <button
            onClick={handleShowContact}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          >
            <ChatIcon width={18} />
          </button>
        )
      }
    </div>
  )
}

export default ActionButtons
