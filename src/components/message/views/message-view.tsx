/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'classnames'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import ErrorMessage from '@/components/ui/error-message'
import Avatar from '@/components/common/avatar'
import {siteSettings} from '@/settings/site.settings'
import MessageNotFound from '@/components/message/views/no-message-found'
import React,{useEffect,useRef} from 'react'
import {useWindowSize} from '@/utils/use-window-size'
import {RESPONSIVE_WIDTH} from '@/utils/constants'
import {
  offset,
  flip,
  autoUpdate,
  useFloating,
  shift,
} from '@floating-ui/react-dom-interactions'
import {useMeQuery} from '@/data/user'


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

interface Props {
  // conversation?: DataChat
  className?: string
  id?: string
  // listen?: boolean
  // loading?: boolean
  messages: any[]
  // error: any
  classes: any
  user: any
  // isSuccess: boolean
  // children: React.ReactNode
  // isLoadingMore: boolean
  // isFetching: boolean
}

const UserMessageView = ({
  id,
  // listen,
  messages = [],
  // error,
  // loading,
  classes,
  user = {},
  // isSuccess,
  // children,
  // isLoadingMore,
  // isFetching,
  ...rest
}: Props) => {
  const {query} = useRouter()
  const {width} = useWindowSize()
  const {data,error: meError} = useMeQuery()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {reference,update,refs} = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [offset(-80),flip(),shift()],
  })

  //default scroll to bottom
  const defaultScrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({behavior: 'smooth'})
  }
  const firstMessage = messages ? messages[0]?.messages : null;
  useEffect(defaultScrollToBottom,[firstMessage])

  // scroll to bottom
  useEffect(() => {
    const chatBody = document.getElementById('chatBody')
    chatBody?.scrollTo({
      top: chatBody?.scrollHeight,
    })
    if (!refs.reference.current || !refs.floating.current) {
      return
    }
    return autoUpdate(refs.reference.current,refs.floating.current,update)
  },[query?.id,refs.reference,refs.floating,update])



  if (meError)
    return (
      <div className="!h-full flex-1">
        <ErrorMessage message={meError?.message} />
      </div>
    )


  return (
    <>
      <div
        id={id}
        className="relative flex-auto flex-grow h-full py-16 overflow-x-hidden overflow-y-auto"
        ref={reference}
        style={{
          maxHeight:
            width >= RESPONSIVE_WIDTH
              ? 'calc(100vh - 336px)'
              : 'calc(100vh - 300px)',
        }}
        {...rest}
      >
        <>
          {!isEmpty(messages) ? (
            <div className="space-y-6">
              {messages.map((item: any,key: number) => {
                const checkUser = Number(data?.id) === item.userId
                return (
                  <div
                    className={`flex w-full gap-x-3 ${checkUser ? 'flex-row-reverse' : ''
                      }`}
                    key={key}
                  >
                    {checkUser ? null : (
                      <div className="w-10">
                        <Avatar
                          src={
                            item?.user?.image ??
                            siteSettings?.avatar?.placeholder
                          }
                          {...rest}
                          name="avatar"
                          className={cn(
                            'relative h-full w-full border-0',
                            user.image
                              ? ''
                              : 'bg-muted-black text-base font-medium text-white'
                          )}
                        />
                      </div>
                    )}
                    <div
                      className={`w-full sm:w-3/4 ${checkUser ? 'text-right' : 'text-left'
                        }`}
                    >
                      <div className="space-y-1">
                        <div>
                          <div
                            className={`${cn(
                              classes?.common,
                              checkUser ? classes?.default : classes?.reverse
                            )}`}
                          >
                            <>{item.content?.replace(/['"]+/g,'')}</>

                          </div>

                          <div className="mt-2 text-xs text-[#686D73]">
                            {dayjs().to(dayjs.utc(item?.createdAt))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <MessageNotFound />
            </>
          )}
        </>

        <div ref={messagesEndRef} />
      </div>
    </>
  )
}

export default UserMessageView
