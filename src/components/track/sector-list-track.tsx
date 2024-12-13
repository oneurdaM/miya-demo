import { useState } from 'react'
import cn from 'classnames'
import Scrollbar from '@/components/ui/scrollbar'
import { capitalizeWords } from '@/utils/functions'

type IProps = {
  className?: string
  title: React.ReactNode
  sectors?: any
  onSelect?: (sector: any) => void
}

type IsectorCard = {
  sector: any
  onSelect?: (sector: any) => void
  isSelected: boolean
  isDisabled: boolean
  showDetails: boolean
  toggleDetails: () => void
}

function SectorCard({
  sector,
  onSelect,
  isSelected,
  isDisabled,
  showDetails,
  toggleDetails,
}: IsectorCard) {
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
          if (!isDisabled && onSelect) onSelect(sector)
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-400 text-white flex items-center justify-center rounded-full shadow-sm">
            <span className="text-sm font-semibold">{sector?.name?.[0]}</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 truncate">
              {sector?.name}
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
            <p className="font-bold">{sector?.user.length|| 0}</p>
          </div>

          {sector?.user && sector?.user.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {sector?.user?.map((user: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 border-b last:border-none pb-2"
                >
                  <div className="h-8 w-8 bg-blue-200 text-white flex items-center justify-center rounded-full shadow-sm">
                    <span className="text-xl  font-mono">
                      {user.firstName?.[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-lg font-medium">
                      {capitalizeWords(user?.firstName)}
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

function SectorListTrack({ className, title, sectors, onSelect }: IProps) {
  const [selectedsector, setSelectedsector] = useState<any | null>(null) 
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null)

  const handleSelectsector = (sector: any) => {
    if (selectedsector?.id === sector.id) {
      setSelectedsector(null)
      if (onSelect) onSelect(null)    
      } else {
      setSelectedsector(sector)
    if (onSelect) onSelect(sector)

    }

  }

  const toggleDetails = (sectorId: string) => {
    setShowDetailsId((prevId) => (prevId === sectorId ? null : sectorId)) 
  }

  return (
    <div className={cn('overflow-hidden rounded-lg bg-white', className)}>
      <h3 className="relative mb-6 text-lg font-semibold text-heading">
        {title}
      </h3>
      <div className="sector-track-scrollbar max-h-[500px] w-full overflow-x-hidden">
        <Scrollbar
          className="h-full w-full"
          options={{ scrollbars: { autoHide: 'never' } }}
        >
          <div className="rounded-md">
            {sectors?.map((sector: any) => (
              <div key={sector.id}>
                <SectorCard
                  sector={sector}
                  onSelect={() => handleSelectsector(sector)}
                  isSelected={selectedsector?.id === sector.id}
                  isDisabled={
                    selectedsector !== null && selectedsector.id !== sector.id
                  }
                  showDetails={showDetailsId === sector.id}
                  toggleDetails={() => toggleDetails(sector.id)}
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
