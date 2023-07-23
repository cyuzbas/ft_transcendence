import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "../UserContext/provider";
import { ChatRoomUser, DmRoomUser, Room, RoomType, RoomUser, UserRole } from "../ChatContext/types";
import { UserContext } from '..';
import { useNavigate } from 'react-router-dom'
import './styles.css'


export const GENERAL_CHAT = {
	roomId: 1,
	roomName: 'Transcendence',
	unreadMessages: 0,
	type: RoomType.PUBLIC,
	userRole: UserRole.MEMBER,
}

type SocketContextValue = {
	URL: string,
	socket: Socket,
	isConnected: boolean,
	room: RoomUser,
	setRoom: React.Dispatch<React.SetStateAction<RoomUser>>,
}

const URL = 'http://localhost:3001';
const socket = io(URL, { autoConnect: false });
const SocketContext = createContext({} as SocketContextValue);

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({ children }: {children: ReactNode}) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [invitationUserName, setInvitationUserName] = useState(' ');
	const [invitationId, setinvitationId] = useState(' ');
	const [room, setRoom] = useState<RoomUser>(GENERAL_CHAT);
	const { user } = useUser();
	// //////////////////////
	const navigate = useNavigate();
	const [gameInvitation, setGameInvitation] = useState(false);

	useEffect(() => {
		function onGameInvite(data: any) {
		  setGameInvitation(true);
		//   console.log('+++++++++++++', data);
		  setInvitationUserName(data.userName);
		  setinvitationId(data.id);
		  console.log("You have an invitation from: ", data.userName);
		}
		

		socket.on('gameinvite', onGameInvite);
		
		return () => {
		  socket.off('gameinvite', onGameInvite);
		};
	  }, []);

	  useEffect(() => {
		function onAccept(data: any) {
		  setGameInvitation(false);
		  console.log("Accept: ", data.message);
		  navigate('/friendgame');
		}
		

		socket.on('gameAccepted', onAccept);
		
		return () => {
		  socket.off('gameAccepted', onAccept);
		};
	  }, []);

	  
// /////////////////////////////////////////////////ibulak
    // const {user} = useContext(UserContext)
		
		
		useEffect(() => {
			if(isConnected) // not necessary in final product?
			socket.disconnect();
			if(user.userName !== 'unknown') {
			// console.log(user);
			socket.auth = { name: user.userName };
			socket.connect();
		}
		setRoom(GENERAL_CHAT);
	}, [user])

	useEffect(() => {
		function onConnect() {
			console.log('connected', socket)
		  	setIsConnected(true);
			socket.emit('joinRoom', room)
		}
	
		function onDisconnect() {
			console.log('disconnected', socket)
		  	setIsConnected(false);
		}

		function onUserId(id: number) {
			// console.log('userId', id);
			// socket.emit()
		}
		
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('userId', onUserId);
	
		return () => {
		  	socket.off('connect', onConnect);
		  	socket.off('disconnect', onDisconnect);
			socket.off('userId');
		 	socket.disconnect();
		};
	}, [user]);

	useEffect(() => {
		socket.emit('joinRoom', room) // join all rooms in loop, and then only in joining a new room so this runs only 1 time
	}, [room])

	const value = {
		URL,
		socket,
		isConnected,
		room,
		setRoom,
	}

	const handleAccept = () => {
		// inviteId: Daveti kabul etmek istediğimiz davetin id'si
		const inviteId = invitationId;
		socket.emit('AcceptInvitation', { id: inviteId });
		console.log('accepted');

	}


    return (
        <SocketContext.Provider value={value}>
			{gameInvitation && 
			<div className="invitation">
				You have a game invitation from {invitationUserName}!
				<button className="accept" onClick={handleAccept}>Accept</button>
				<button className="reject">Reject</button>
			</div>}
            {children}
        </SocketContext.Provider>
    );
}