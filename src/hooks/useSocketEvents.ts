// hooks/useSocketEvents.ts
import {useEffect} from 'react';
import {Socket} from 'socket.io-client';
import {toast} from 'react-toastify';
import {UserTrackType} from '@/types';

export const useSocketEvents = (socket: Socket,updateState: (data: any) => void) => {
	useEffect(() => {
		if (socket) {
			socket.on('connect',() => {
				updateState({online: true});
			});

			socket.on('disconnect',() => {
				updateState({online: false});
			});

			socket.on('new_alert',(alert: any) => {
				toast.error(alert.content);
				updateState((prev: any) => ({
					...prev,
					notifications: prev.notifications + 1,
				}));
			});

			socket.on('user_track',(data: UserTrackType) => {
				updateState({user_track: data});
			});

			return () => {
				socket.off('connect');
				socket.off('disconnect');
				socket.off('new_alert');
				socket.off('user_track');
			};
		}
	},[socket]);
};
