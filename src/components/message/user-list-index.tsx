import {useTranslation} from 'next-i18next'
import UserBoxHeaderView from '@/components/message/user-box-header'
import UserListView from '@/components/message/user-list'
import cn from 'classnames'
import {useModalAction} from '@/components/ui/modal/modal.context'
import {useWindowSize} from '@/utils/use-window-size'
import {RESPONSIVE_WIDTH} from '@/utils/constants'
import {useState} from 'react'
import {ComposeEditIcon} from '../icons/edit'
interface Props {
  className?: string
}

const UserListIndex = ({className,...rest}: Props) => {
  const {t} = useTranslation()
  const {openModal} = useModalAction()
  const [text,setText] = useState('')
  const {width} = useWindowSize()

  function handleComposeClick() {
    openModal('COMPOSE_MESSAGE')
  }

  function handleComposeGroupClick() {
    openModal('COMPOSE_MESSAGE_GROUP')
  }

  return (
    <>
      <div
        className={cn(
          width >= RESPONSIVE_WIDTH
            ? 'max-w-[4rem] sm:max-w-xs 2xl:max-w-[21.875rem]'
            : '',
          'flex max-h-screen flex-1 flex-col overflow-hidden rounded-lg bg-white',
          // adminPermission ? 'pb-6' : '',
          className
        )}
        {...rest}
      >
        {/* header search view */}
        <UserBoxHeaderView
          onChange={(event: any) => setText(event?.target?.value)}
          value={text}
          clear={() => setText('')}
          className="shrink-0"
        />

        {/* conversation list view */}
        <div className="h-full overflow-y-auto">
          <UserListView
            filterText={text}
            // permission={adminPermission}
            permission={true}
          />
        </div>

        {/* {adminPermission ? ( */}
        <div className="block">
          <span
            onClick={handleComposeClick}
            className="flex w-full cursor-pointer items-center justify-center gap-2 p-5 text-center text-base font-medium text-[#0f7ebf]"
          >
            <span className="flex h-9 w-9 rounded-full bg-[#E0EFEC]">
              <ComposeEditIcon className="m-auto" />
            </span>
            {t('text-compose')}
          </span>

          <span
            onClick={handleComposeGroupClick}
            className="flex w-full bg-gray-500/20 cursor-pointer items-center justify-center gap-2 p-5 text-center text-base font-medium text-[#0f7ebf]"
          >
            <span className="flex h-9 w-9 rounded-full bg-[#E0EFEC]">
              <ComposeEditIcon className="m-auto" />
            </span>
            {t('text-compose-group')}
          </span>
        </div>
        {/* ) : (
          ''
        )} */}
      </div>
    </>
  )
}

export default UserListIndex
