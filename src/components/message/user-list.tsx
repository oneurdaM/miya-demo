import {useSocketContext} from '@/contexts/socket.context';
import React from 'react';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import isEmpty from 'lodash/isEmpty';
import ListView from './views/list-view';

interface Props {
  className?: string;
  filterText?: string;
  permission: boolean;
}

const UserList = ({className,filterText,permission,...rest}: Props) => {
  const {conversations} = useSocketContext();

  return (
    <div className={cn('flex-auto',permission ? 'pb-6' : '')} {...rest}>
      {conversations?.length > 0 ? (
        <Scrollbar
          className="h-full w-full"
          options={{
            scrollbars: {
              autoHide: 'never',
            },
          }}
        >
          {conversations.map((conversation: any,key: number) => (
            <ListView
              key={key}
              conversation={conversation}
              className={className}
            />
          ))}
        </Scrollbar>
      ) : (
        <p className="text-center text-gray-500">No hay conversaciones disponibles.</p>
      )}
    </div>
  );
};

export default UserList;
