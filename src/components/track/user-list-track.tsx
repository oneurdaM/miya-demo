import cn from 'classnames'
import Scrollbar from '@/components/ui/scrollbar'
import Image from 'next/image'
import {siteSettings} from '@/settings/site.settings'
import {useRouter} from 'next/router'

type IProps = {
  className?: string
  title: React.ReactNode
  users?: any
}

type IUserCard = {
  user: any
}
function UserCard({user}: IUserCard) {
  const router = useRouter()

  const selectUser = (id: number) => {
    console.log('id selected',id)
    router.push({
      pathname: '/track/' + id,
    })
  }


  return (
    <div
      className={`flex flex-wrap items-center  p-2 rounded-md hover:cursor-pointer ${user?.online
        ? 'bg-green-200 hover:bg-green-400 '
        : 'bg-gray-200 hover:bg-gray-300'
        }`}
      onClick={() => {
        selectUser(user.id)
      }}
    >
      <div className="flex w-full items-center pe-2 ">
        <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border-200/60 bg-gray-100">
          <Image
            alt={user?.firstName}
            src={user?.image || siteSettings.avatar.placeholder}
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="w-4/5 ps-3">
          <h4
            className={`-mb-px truncate text-[15px]  font-bold  text-heading text-center rounded-t-md ${user.user?.online ? 'bg-green-100' : 'bg-gray-100'
              }`}
          >
            {user?.firstName} {user?.lastName}
          </h4>
          <p className="text-[13px] text-body  bg-white text-center rounded-b-md ">
            <strong className="ml-1">{user?.jobPosition?.name}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

function UsersListTrack({className,title,users}: IProps) {

  return (
    <div className={cn('overflow-hidden rounded-lg bg-white p-6 md:p-7',className)}>
      <h3 className="relative mb-6 text-lg font-semibold text-heading">
        {title}
      </h3>
      <div className="user-track-scrollbar h-full max-h-[372px] w-full overflow-x-hidden">
        <Scrollbar
          className="h-full w-full pe-3"
          options={{scrollbars: {autoHide: 'never'}}}
        >
          <div className="space-y-4">
            {users?.map((user: any,index: number) => (
              <UserCard key={index} user={user} />
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
}

export default UsersListTrack;

