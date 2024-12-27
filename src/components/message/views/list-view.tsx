import React from 'react';
import cn from 'classnames';
import {useRouter} from 'next/router';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {useMeQuery} from '@/data/users';
import Loader from '@/components/ui/loader/loader';
import {Routes} from '@/config/routes';
import CameraIconChat from '@/components/icons/camera-icon';
import PDFIcon from '@/components/icons/pdf-solid';
import {capitalizeWords} from '@/utils/functions';
import {useSocketContext} from '@/contexts/socket.context';
import Avatar from '@/components/common/avatar';
import { siteSettings } from '@/settings/site.settings';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  conversation: any;
  className?: string;
}

const UserListView = ({conversation,className,...rest}: Props) => {
  const router = useRouter();
  const {data,loading} = useMeQuery();

  if (loading) return <Loader text="Loading..." />;

  const isGroup = conversation?.conversation?.participants.length > 2;

  const participant = conversation?.conversation?.participants?.find(
    (participant: any) => participant?.user?.id !== data?.id
  );

  const conversationId = conversation?.conversationId;
  const routes = Routes?.message?.details({id: conversationId?.toString()});

  const handleConversationClick = () => {
    if (conversationId) {
      router.push(routes);
    }
  };

  const latestMessage = conversation?.conversation?.messages?.at(-1);

  return (
    <div
      className={cn(
        'relative cursor-pointer border-b border-solid border-b-[#E5E7EB] transition-all duration-500 hover:bg-[#e4e5e7]',
        Number(router?.query?.id) === conversationId ? 'bg-[#F3F4F6]' : '',
        className
      )}
      onClick={handleConversationClick}
      {...rest}
    >
      {!latestMessage?.seen && (
        <div className="absolute left-2 top-1/2 z-50 h-[.375rem] w-[.375rem] -translate-y-1/2 transform rounded-full bg-[#EF4444]"></div>
      )}
      <div className="flex w-full gap-x-3 p-3 sm:p-6">
        <div className="relative h-8 w-8 overflow-hidden rounded-full 2xl:h-10 2xl:w-10">
          { participant?.user?.image ? (

             <Image
            src={isGroup ? '/logo.png' : participant?.user?.image || '/default-avatar.png'}
            alt="Avatar"
            fill
            sizes="(max-width: 768px) 100vw"
            className="product-image object-contain"
          />
          ): 
          
          (
            <Avatar
            src={siteSettings?.avatar?.placeholder}
         
            name={ participant?.user?.firstName as string}
    
           
          />

          )}
         
        </div>
        <div className="block w-10/12">
          <div className="flex items-center justify-between">
            <h2 className="mr-1 w-[70%] truncate text-sm font-semibold">
              {isGroup
                ? capitalizeWords(participant?.user?.jobPosition?.name || 'Group')
                : participant?.user?.firstName || 'Usuario'}
            </h2>
            <p className="truncate text-xs text-[#686D73]">
              {latestMessage?.createdAt
                ? dayjs().to(dayjs.utc(latestMessage.createdAt))
                : ''}
            </p>
          </div>
          <p className="text-xs text-[#64748B] truncate">
            {latestMessage?.content?.startsWith('data:image') ? (
              <div className="flex items-center">
                <CameraIconChat className="mr-2" />
                <span className="text-sm">Imagen</span>
              </div>
            ) : latestMessage?.content?.endsWith('.pdf') ? (
              <div className="flex items-center">
                <PDFIcon width={15} className="mr-2" />
                <span className="text-sm">Archivo PDF</span>
              </div>
            ) : (
              latestMessage?.content || 'Sin mensajes'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserListView;
