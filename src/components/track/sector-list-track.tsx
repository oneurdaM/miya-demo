import { useState } from 'react'
import cn from 'classnames'
import Scrollbar from '@/components/ui/scrollbar'

type IProps = {
  className?: string
  title: React.ReactNode
  users?: any
  onSelect?: (user: any) => void // Callback para notificar selección
}

type IUserCard = {
  user: any
  onSelect?: (user: any) => void // Callback recibido para seleccionar usuario
  isSelected: boolean // Indica si este usuario está seleccionado
  isDisabled: boolean // Indica si este usuario está deshabilitado
}

function UserCard({ user, onSelect, isSelected, isDisabled }: IUserCard) {
  return (
    <div className="px-2 p-4 border-b-2">
      <div
        className={cn(
          'flex flex-wrap items-center p-4 rounded-md',
          {
            'bg-teal-900': isSelected, // Color si está seleccionado
            'pointer-events-none opacity-50': isDisabled, // Estilo si está deshabilitado
            'hover:cursor-pointer': !isDisabled // Habilitar cursor solo si está activo
          },
          user?.color // Color predeterminado
        )}
        onClick={() => {
          if (!isDisabled && onSelect) onSelect(user) // Enviar todo el objeto usuario
        }}
      >
        <div className="flex w-full items-center pe-2">
          <div className="w-full ps-3">
            <h4
              className="truncate text-[20px] font-bold text-heading text-center rounded-md bg-gray-100"
            >
              <div className="flex justify-between px-10">
                <p>{user?.name}</p>
                <p className="text-base">Usuarios en este sector: 10</p>
              </div>
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectorListTrack({ className, title, users, onSelect }: IProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null) // Estado global de selección

  const handleSelectUser = (user: any) => {
    // Si el usuario ya está seleccionado, lo deseleccionamos
    if (selectedUser?.id === user.id) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user) // Selecciona el nuevo usuario
    }

    if (onSelect) onSelect(user) // Notifica al componente padre con el objeto completo
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
                key={user.id} // Usa `user.id` como clave
                user={user}
                onSelect={handleSelectUser}
                isSelected={selectedUser?.id === user.id} // Determina si está seleccionado
                isDisabled={selectedUser !== null && selectedUser.id !== user.id} // Desactiva si no es el seleccionado
              />
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default SectorListTrack
