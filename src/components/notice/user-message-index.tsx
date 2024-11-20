import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import UserMessageView from '@/components/message/views/message-view'
import SelectConversation from '@/components/message/views/select-conversation'
import CreateMessageForm from '@/components/message/views/form-view'
import HeaderView from '@/components/message/views/header-view'
import {useWindowSize} from '@/utils/use-window-size'
import {RESPONSIVE_WIDTH} from '@/utils/constants'
import {useMeQuery} from '@/data/user'
import {useSocketContext} from '@/contexts/socket.context'
import {useEffect,useState} from 'react'

interface Props {
  className?: string
}

const UserMessageIndex = ({className,...rest}: Props) => {
  const router = useRouter();
  const {query} = router;
  const {data} = useMeQuery();
  const {width} = useWindowSize();
  const {conversations} = useSocketContext();
  const [participant,setParticipant] = useState<any>();


  const [messages,setMessages] = useState<any[]>([]);

  const classes = {
    common: 'inline-block rounded-[8px] px-4 py-2 break-all leading-[150%] text-sm',
    default: 'bg-[#FAFAFA] text-left text-base-dark',
    reverse: 'bg-accent text-white',
  };

  const conversation = conversations?.find(
    (conversation) => conversation?.conversationId === Number(query.id)
  );


  useEffect(() => {
    if (conversation) {
      setMessages(conversation.conversation.messages || []);
      handleParticipant();
    }
  },[conversation]);

  const handleNewMessage = (newMessage: any) => {
    setMessages((prevMessages) => [...prevMessages,newMessage]);
  };

  const handleParticipant = () => {
    const participants = conversation?.conversation.participants;

    const participant = participants?.find(
      (participant: any) => participant.user?.id !== data?.id
    );


    setParticipant(participant);
  }


  return (
    <>
      <div
        className={cn(
          'flex h-[44em] max-h-[calc(100%-51px)] flex-1 items-stretch bg-[#F3F4F6]',
          width >= RESPONSIVE_WIDTH ? '2xl:max-w-[calc(100%-26rem)]' : '',
          className
        )}
        {...rest}
      >
        {!isEmpty(query?.id) ? (
          <>
            <div className="flex max-h-screen w-full flex-col overflow-hidden rounded-xl bg-white p-6">
              <HeaderView
                user={participant?.user}
              />
              <UserMessageView
                id="chatBody"
                messages={messages}
                user={participant?.user}
                classes={classes}
              />
              <div className="relative mt-auto">
                <CreateMessageForm
                  user={participant}
                  onNewMessage={handleNewMessage}
                />
              </div>
            </div>
          </>
        ) : (
          <>{width >= RESPONSIVE_WIDTH ? <SelectConversation /> : ''}</>
        )}
      </div>
    </>
  );
};


export default UserMessageIndex
