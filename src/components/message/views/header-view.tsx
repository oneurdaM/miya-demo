import cn from 'classnames'

import Avatar from '@/components/common/avatar'
import {siteSettings} from '@/settings/site.settings'
import {Participant} from '@/types'
import {useWindowSize} from '@/utils/use-window-size'
import {ExternalLinkIconNew} from '@/components/icons/external-link'

import Link from '@/components/ui/link'
import {Routes} from '@/config/routes'
import {BackIcon} from '@/components/icons/back-icon'
import {RESPONSIVE_WIDTH} from '@/utils/constants'
import {formatDate} from '@/utils/format-date'

interface Props {
  className?: string
  user: Participant
}

const HeaderView = ({className,user,...rest}: Props) => {
  const {width} = useWindowSize()

  return (
    <>
      <div
        className={cn(
          'relative flex shrink-0 items-center border-b border-solid border-b-[#E7E7E7] bg-white pb-6',
          width >= RESPONSIVE_WIDTH ? '' : '',
          className
        )}
        {...rest}
      >
        {width <= RESPONSIVE_WIDTH ? (
          <Link
            href={Routes.message.list}
            className="mr-1 inline-block p-1 pl-0 text-2xl transition-colors duration-300 hover:text-accent-hover"
          >
            <BackIcon />
          </Link>
        ) : (
          ''
        )}
        <div
          className={`flex items-center gap-2 cursor-pointer`}
        >
          <Avatar
            src={user?.image ?? siteSettings?.avatar?.placeholder}
            {...rest}
            name={user?.firstName as string}
            className={cn(
              'relative h-10 w-10 border-0',
              user?.image
                ? ''
                : 'bg-muted-black text-base font-medium text-white'
            )}
          />
          {user?.firstName ? (
            <div className="flex flex-col">
              <h2 className="flex items-center gap-2 text-lg font-semibold capitalize text-muted-black">
                {user?.firstName}
                <Link
                  href={`/users/${user?.id}`}
                  target="_blank"
                  className="text-xl text-[#929292] transition-colors duration-300 hover:text-opacity-60"
                  title={user?.firstName}
                >
                  <ExternalLinkIconNew />
                </Link>
              </h2>
              <span className="text-[#929292] text-sm">
                {formatDate(user?.lastSeen ?? '')}
              </span>
            </div>
          ) : (
            <span className="text-xl">Unknown Group</span>
          )}
        </div>
      </div>
    </>
  )
}

export default HeaderView
