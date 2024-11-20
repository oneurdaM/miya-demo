/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{createContext,useContext,useEffect,useState,useCallback} from 'react';
import useSocket from '@/hooks/useSocket';
import {toast} from 'react-toastify';

interface SocketContextType {
  online: boolean;
  notifications: number;
  online_users?: any[];
  conversations?: any[];
  all_users?: any[];
  tracked_users?: any[];
  user_track: any;
  user_id?: string | null;
  resetNotificationsCount: () => void;
  createChat: (value: any) => void;
  createChatGroup: (value: any) => void;
  leaveRoom: (value: any) => void;
  joinRoom: (value: any) => void;
  sendMessage: (value: any) => void;
  fetchConversations: () => void;
  resetMessages: (conversationId: string) => void;
  fetchChatHistory: (conversationId: string) => void;
  fetchUsersOnline: () => void;
  fetchAllUsers: () => void;
  fetchTrackedUsers: () => void;
  trackUser: (userId: string) => void;
  subscribeUserList: () => void;
  fetchOnlineUsersWithLastLocation: () => void; // Agregado para usuarios con ubicación
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const URL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT || 'http://localhost:1337';

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [socketContext,setSocketContext] = useState<SocketContextType>({
    online: false,
    notifications: 0,
    online_users: [],
    tracked_users: [],
    all_users: [],
    conversations: [],
    user_track: {},
    user_id: null,
    resetNotificationsCount: () => { },
    createChat: () => { },
    createChatGroup: () => { },
    leaveRoom: () => { },
    joinRoom: () => { },
    sendMessage: () => { },
    fetchConversations: () => { },
    fetchChatHistory: () => { },
    resetMessages: () => { },
    fetchUsersOnline: () => { },
    trackUser: () => { },
    subscribeUserList: () => { },
    fetchTrackedUsers: () => { },
    fetchAllUsers: () => { },
    fetchOnlineUsersWithLastLocation: () => { }, // Inicializado
  });

  const socket = useSocket(URL);

  /** Emit socket events */
  const createChat = useCallback((value: any) => socket?.emit('createChatAdminApi',value),[socket]);
  const createChatGroup = useCallback((value: any) => socket?.emit('createChatGroupAdmin',value),[socket]);
  const sendMessage = useCallback((value: any) => socket?.emit('sendMessage',value),[socket]);
  const leaveRoom = useCallback((room: string) => socket?.emit('event_leave',room),[socket]);
  const joinRoom = useCallback((room: string) => socket?.emit('event_join',room),[socket]);

  const fetchConversations = useCallback(() => {
    socket?.emit('chatAdminApi');
  },[socket]);

  const fetchChatHistory = useCallback((conversationId: string) => {
    socket?.emit('event_join',conversationId);
  },[socket]);

  const resetMessages = useCallback((conversationId: string) => {
    setSocketContext((prev) => ({
      ...prev,
      conversations: prev.conversations?.map((conversation) =>
        conversation.id === conversationId ? {...conversation,messages: []} : conversation
      ),
    }));
  },[]);

  const fetchUsersOnline = useCallback(() => {
    socket?.emit('get_user_list');
  },[socket]);

  const trackUser = useCallback((userId: string) => {
    socket?.emit('track_user',{userId});
  },[socket]);



  const fetchAllUsers = useCallback(() => {
    socket?.emit('subscribe_user_list');
  },[socket]);

  const fetchOnlineUsersWithLastLocation = useCallback(() => {
    socket?.emit('get_online_users_with_location');
  },[socket]);

  /** Handle incoming socket events */
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket conectado');
      setSocketContext((prev) => ({...prev,online: true}));
      fetchConversations();
      fetchAllUsers();
      fetchOnlineUsersWithLastLocation();
    };

    const handleDisconnect = (reason: string) => {
      console.warn('Socket desconectado:',reason);
      setSocketContext((prev) => ({...prev,online: false}));
    };

    const handleConversations = (data: any) => {
      setSocketContext((prev) => ({...prev,conversations: data.conversations}));
    };

    const handleNewMessage = (newMessage: any) => {

      setSocketContext((prev) => {
        const updatedConversations = prev.conversations?.map((conversation) => {
          if (conversation.conversationId === newMessage.conversationId) {
            return {
              ...conversation,
              conversation: {
                ...conversation.conversation,
                messages: [
                  ...conversation.conversation.messages,
                  {
                    id: newMessage.id,
                    content: newMessage.content,
                    conversationId: newMessage.conversationId,
                    createdAt: newMessage.createdAt,
                    type: newMessage.type,
                    seen: newMessage.seen,
                    userId: newMessage.userId,
                    user: {
                      id: newMessage.userId,
                      firstName: newMessage.user?.firstName,
                      image: newMessage.user?.image,
                    },
                  },
                ],
              },
            };
          }
          return conversation;
        });

        return {
          ...prev,
          conversations: updatedConversations,
        };
      });
    };



    const handleUserList = (data: any[]) => {
      setSocketContext((prev) => ({...prev,all_users: data}));
    };

    const handleOnlineUsersWithLocation = (data: any[]) => {
      setSocketContext((prev) => ({...prev,online_users: data}));
    };

    const handleNewLocation = (data: Array<{
      socketId: string;
      userId: string;
      latitude: number;
      longitude: number;
      user: {
        userId: number;
        name: string;
        email: string;
        role: string;
        documents: any[];
        icon: string;
        image: string;
        jobposition?: string;
        requireDocuments: any[];
      };
    }>) => {
      setSocketContext((prev) => {
        const updatedOnlineUsers = prev.online_users?.map((user) => {
          const newUser = data.find((u) => parseInt(u.userId) === user.id);
          if (newUser) {
            return {
              ...user,
              location: {
                latitude: newUser.latitude,
                longitude: newUser.longitude,
                lastUpdated: new Date().toISOString(),
              },
            };
          }
          return user;
        }) ?? [];

        data.forEach((newUser) => {
          if (!updatedOnlineUsers.some((user) => user.id === parseInt(newUser.userId))) {
            updatedOnlineUsers.push({
              id: parseInt(newUser.userId),
              firstName: newUser.user.name.split(' ')[0],
              lastName: newUser.user.name.split(' ')[1] || '',
              email: newUser.user.email,
              role: newUser.user.role,
              image: newUser.user.image,
              icon: newUser.user.icon,
              location: {
                latitude: newUser.latitude,
                longitude: newUser.longitude,
                lastUpdated: new Date().toISOString(),
              },
            });
          }
        });

        return {...prev,online_users: updatedOnlineUsers};
      });
    };

    const handleNewAlert = (data: any) => {
      const message = `Nueva alerta recibida ${data.content}`;
      toast.error(message,{
        autoClose: 5000,
      });
    }


    socket.on('connect',handleConnect);
    socket.on('disconnect',handleDisconnect);
    socket.on('chatAdminClient',handleConversations);
    socket.on('newMessageClientAdmin',handleNewMessage);
    socket.on('user_list',handleUserList);
    socket.on('online_users_with_location',handleOnlineUsersWithLocation);
    socket.on('realtime_user_list',handleNewLocation);
    socket.on('new_alert',handleNewAlert);

    socket.on('user_track',(data: any) => {
      console.log('Usuario rastreado:',data);
      setSocketContext((prev) => ({...prev,user_track: data}));
    }
    );
    return () => {
      socket.off('connect',handleConnect);
      socket.off('disconnect',handleDisconnect);
      socket.off('chatAdminClient',handleConversations);
      socket.off('newMessageClientAdmin',handleNewMessage);
      socket.off('user_list',handleUserList);
      socket.off('online_users_with_location',handleOnlineUsersWithLocation);
      socket.off('realtime_user_list',handleNewLocation);
      socket.off('new_alert',handleNewAlert);
      socket.off('user_track');
    };
  },[
    socket,
    fetchConversations,
    fetchAllUsers,
    fetchOnlineUsersWithLastLocation,
  ]);

  return (
    <SocketContext.Provider
      value={{
        ...socketContext,
        createChat,
        createChatGroup,
        sendMessage,
        leaveRoom,
        joinRoom,
        fetchConversations,
        resetMessages,
        fetchChatHistory,
        fetchUsersOnline,
        trackUser,
        fetchAllUsers,
        fetchOnlineUsersWithLastLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext debe usarse dentro de un SocketProvider');
  }
  return context;
};
