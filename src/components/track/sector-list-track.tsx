import { useState } from 'react'
import cn from 'classnames'
import Scrollbar from '@/components/ui/scrollbar'

type IProps = {
  className?: string
  title: React.ReactNode
  users?: any
  onSelect?: (user: any) => void
}

type IUserCard = {
  user: any
  onSelect?: (user: any) => void 
  isSelected: boolean 
  isDisabled: boolean 
}

function UserCard({ user, onSelect, isSelected, isDisabled }: IUserCard) {
  return (
    <div className="px-2 p-4 border-b-2">
      <div
        className={cn(
          'flex flex-wrap items-center p-4 rounded-md',
          {
            'bg-teal-900': isSelected, 
            'pointer-events-none opacity-50': isDisabled, 
            'hover:cursor-pointer': !isDisabled 
          },
          user?.color
        )}
        onClick={() => {
          if (!isDisabled && onSelect) onSelect(user)
        }}
      >
        <div className="flex w-full items-center pe-2">
          <div className="w-full ps-3">
            <h4
              className="truncate text-[20px] font-bold text-heading text-center rounded-md bg-gray-100"
            >
              <div className="flex justify-between px-10">
                <p>{user?.name}</p>
                <p className="text-base">Usuarios en este sector: {user.userCont}</p>
              </div>
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectorListTrack({ className, title, users, onSelect }: IProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null) 

  const handleSelectUser = (user: any) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user) 
    }

    if (onSelect) onSelect(user) 
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg bg-white p-6 md:p-7 border-2',
        className
      )}
    >
      <h3 className="relative mb-6 text-lg font-semibold text-heading">
        {title}
      </h3>
      <div className="user-track-scrollbar h-full max-h-[372px] w-full overflow-x-hidden">
        <Scrollbar
          className="h-full w-full pe-3"
          options={{ scrollbars: { autoHide: 'never' } }}
        >
          <div className="border-2 rounded-md">
            {users?.map((user: any) => (
              <UserCard
                key={user.id} 
                user={user}
                onSelect={handleSelectUser}
                isSelected={selectedUser?.id === user.id} 
                isDisabled={selectedUser !== null && selectedUser.id !== user.id} 
              />
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default SectorListTrack
