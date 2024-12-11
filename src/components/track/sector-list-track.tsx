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
  showDetails: boolean
  toggleDetails: () => void
}

function UserCard({
  user,
  onSelect,
  isSelected,
  isDisabled,
  showDetails,
  toggleDetails,
}: IUserCard) {
  return (
    <div className="my-3">
      <div
        className={cn(
          'mx-3 flex items-center hover:cursor-pointer justify-between rounded-lg border shadow-xl p-4 transition-transform transform duration-200 ease-in-out hover:scale-105',
          {
            'bg-teal-100 border-teal-500': isSelected,
            'pointer-events-none opacity-50': isDisabled,
          }
        )}
        onClick={() => {
          if (!isDisabled && onSelect) onSelect(user)
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-400 text-white flex items-center justify-center rounded-full shadow-sm">
            <span className="text-sm font-semibold">{user?.name?.[0]}</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 truncate">
              {user?.name}
            </h4>
            <p className="text-sm text-gray-500 truncate">Sector activo</p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            className="px-3 py-1 bg-green-100 border-green-200 border hover:bg-green-300 text-xs rounded-md transition ease-in-out"
            onClick={(e) => {
              e.stopPropagation() 
              toggleDetails() 
            }}
          >
            {showDetails ? 'Ocultar Info' : 'Ver Info'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="p-3 mt-1 mx-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-700 rounded-b-md">
          <div className="flex justify-between font-bold">
            <p>Usuarios en el sector</p>
            <p className="font-bold">{user.userCount || 0}</p>
          </div>

          {user.users && user.users.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {user.users.map((sectorUser: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 border-b last:border-none pb-2"
                >
                  <div className="h-8 w-8 bg-blue-200 text-white flex items-center justify-center rounded-full shadow-sm">
                    <span className="text-xs font-semibold">
                      {sectorUser.name?.[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-sm font-medium">
                      {sectorUser.name}
                    </span>
                   
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500 italic">
              No hay usuarios en este sector.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function SectorListTrack({ className, title, users, onSelect }: IProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null) 
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null)

  const handleSelectUser = (user: any) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user)
    }

    if (onSelect) onSelect(user)
  }

  const toggleDetails = (userId: string) => {
    setShowDetailsId((prevId) => (prevId === userId ? null : userId)) 
  }

  return (
    <div className={cn('overflow-hidden rounded-lg bg-white', className)}>
      <h3 className="relative mb-6 text-lg font-semibold text-heading">
        {title}
      </h3>
      <div className="user-track-scrollbar max-h-[500px] w-full overflow-x-hidden">
        <Scrollbar
          className="h-full w-full"
          options={{ scrollbars: { autoHide: 'never' } }}
        >
          <div className="rounded-md">
            {users?.map((user: any) => (
              <div key={user.id}>
                <UserCard
                  user={user}
                  onSelect={() => handleSelectUser(user)}
                  isSelected={selectedUser?.id === user.id}
                  isDisabled={
                    selectedUser !== null && selectedUser.id !== user.id
                  }
                  showDetails={showDetailsId === user.id}
                  toggleDetails={() => toggleDetails(user.id)}
                />
              </div>
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default SectorListTrack
