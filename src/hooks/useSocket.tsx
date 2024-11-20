import {getAuthCredentials} from '@/utils/auth-utils';
import {useEffect,useState} from 'react';
import {io,Socket} from 'socket.io-client';

const useSocket = (url: string): Socket | null => {
  const {token} = getAuthCredentials();
  const [socket,setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn('Token no encontrado, no se establecerá la conexión del socket.');
      return;
    }



    const socketInstance = io(url,{
      auth: {
        token,
      },
      transports: ['websocket','polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    // Manejo de eventos de conexión
    socketInstance.on('connect',() => {
      console.log('Socket conectado:',socketInstance.id);
    });

    socketInstance.on('disconnect',(reason) => {
      console.warn('Socket desconectado:',reason);
      if (reason === 'io server disconnect') {
        console.warn('El servidor cerró la conexión. Intentando reconectar...');
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error',(error) => {
      console.error('Error al conectar el socket:',error.message);
    });

    socketInstance.on('reconnect_attempt',(attemptNumber) => {
      console.info(`Intentando reconectar (intento ${attemptNumber})...`);
    });

    socketInstance.on('reconnect',() => {
      console.info('Reconexión exitosa.');
    });

    socketInstance.on('reconnect_failed',() => {
      console.error('Falló la reconexión después de varios intentos.');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  },[url,token]);

  return socket;
};

export default useSocket;
