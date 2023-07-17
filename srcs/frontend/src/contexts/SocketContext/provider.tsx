import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useUser } from "../UserContext/provider";

type SocketContextValue = {
	URL: string,
	socket: Socket,
	isConnected: boolean,
}

const URL = 'http://localhost:3001';
const socket = io(URL, { autoConnect: false });
const SocketContext = createContext({} as SocketContextValue);

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({ children }: {children: ReactNode}) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const { user } = useUser();
		
	useEffect(() => {
		if(isConnected) { // not necessary in final product?
			socket.disconnect();
		};

		if(user.userName !== 'unknown') {
			socket.auth = { 
				name: user.userName ,
				intraId: user.intraId,
			}
			socket.connect();
		};

	}, [user])

	useEffect(() => {
		function onConnect() {
			console.log('connected', socket)
		  	setIsConnected(true);
		};
	
		function onDisconnect() {
			console.log('disconnected', socket)
		  	setIsConnected(false);
		};
		
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
	
		return () => {
		  socket.off('connect', onConnect);
		  socket.off('disconnect', onDisconnect);
		 	socket.disconnect();
		};
	}, [user]);

	const value = {
		URL,
		socket,
		isConnected,
	}
	
	return (
			<SocketContext.Provider value={value}>
					{children}
			</SocketContext.Provider>
	);
}