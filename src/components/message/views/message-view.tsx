import cn from 'classnames'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import ErrorMessage from '@/components/ui/error-message'
import {useTranslation} from 'next-i18next'
import Avatar from '@/components/common/avatar'
import {siteSettings} from '@/settings/site.settings'
import MessageNotFound from '@/components/message/views/no-message-found'
import React,{useEffect,useState,useRef} from 'react'
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
import Image from 'next/image'
import PDFIcon from '@/components/icons/pdf-solid'

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
  className,
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
  const [visible,setVisible] = useState(false)
  const {data,loading: meLoading,error: meError} = useMeQuery()

  const messagesEndRef = useRef(null)
  const {reference,update,refs} = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [offset(-80),flip(),shift()],
  })

  //default scroll to bottom
  const defaultScrollToBottom = () => {
    //@ts-ignore
    messagesEndRef?.current?.scrollIntoView({behavior: 'smooth'})
  }
  useEffect(defaultScrollToBottom,[messages ? messages[0]?.messages : null])

  // scroll to bottom
  useEffect(() => {
    const chatBody = document.getElementById('chatBody')
    // @ts-ignore
    chatBody?.scrollTo({
      top: chatBody?.scrollHeight,
    })
    if (!refs.reference.current || !refs.floating.current) {
      return
    }
    return autoUpdate(refs.reference.current,refs.floating.current,update)
  },[query?.id,refs.reference,refs.floating,update])

  useEffect(() => {
    const chatBody = document.getElementById('chatBody')
    const toggleVisible = () => {
      if (
        Number(
          Number(chatBody?.scrollHeight) - Number(chatBody?.clientHeight)
        ) !== Number(chatBody?.scrollTop) &&
        Number(chatBody?.clientHeight) <= Number(chatBody?.scrollHeight)
      ) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    chatBody?.addEventListener('scroll',toggleVisible)
    return () => {
      chatBody?.removeEventListener('scroll',toggleVisible)
    }
  },[])

  // if (loading || meLoading)
  //   return (
  //     <Loader
  //       className="!h-full flex-1"
  //       text={t('common:text-loading') ?? ''}
  //     />
  //   )
  if (meError)
    return (
      <div className="!h-full flex-1">
        <ErrorMessage message={meError?.message} />
      </div>
    )

  function openPdfInNewTab(url: string) {
    window.open(url,'_blank')
  }


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
                          //@ts-ignore
                          // src={user.image ?? siteSettings?.avatar?.placeholder}
                          src={
                            item?.user?.image ??
                            siteSettings?.avatar?.placeholder
                          }
                          {...rest}
                          name="avatar"
                          className={cn(
                            'relative h-full w-full border-0',
                            //@ts-ignore
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
