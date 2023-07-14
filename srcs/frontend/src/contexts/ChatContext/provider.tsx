import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import axios from "axios";
import { AxiosResponse } from "axios";
import { ChatRoomUser, DmRoomUser, Member, Message, Room, RoomType, RoomUser, UserRole } from "./types";
// import { useUser } from "../../contexts/UserProvider";
import { useSocket } from "../SocketContext/provider";
import { User, useUser } from "../UserContext";

export type ChatContextValue = {
    room: RoomUser,
    chatRooms: ChatRoomUser[],
    dmRooms: DmRoomUser[],
    blocked: User[],
    messages: Message[],
    allUsers: User[],
    members: Member[],
    setRoom: React.Dispatch<React.SetStateAction<RoomUser | null>>,
    setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomUser[]>>,
    setDmRooms: React.Dispatch<React.SetStateAction<DmRoomUser[]>>,
    setBlocked: React.Dispatch<React.SetStateAction<User[]>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    getAllPublicRooms: () => Promise<Room[]>,
    createDmRoom: (newContact: string) => Promise<DmRoomUser>,
    addRoomUser: (addRoom: string, addUser: string) => Promise<ChatRoomUser>,
    updateRoomUser: (updatedRoomUser: Member) => Promise<void>,
    updateRoom: (updatedRoom: Room) => Promise<void>,
    handleUnreadMessage: (roomName: string) => Promise<void>
};

const ChatContext = createContext({} as ChatContextValue);

export function useChat() { //try catch blocks check returns
	return useContext(ChatContext);
}

export function ChatProvider({ children }: {children: ReactNode}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
	const [room, setRoom] = useState<RoomUser | null>(null)//GENERAL_CHAT);

    const [chatRooms, setChatRooms] = useState<ChatRoomUser[]>([]);
    const [dmRooms, setDmRooms] = useState<DmRoomUser[]>([]);
    const [members, setMembers] = useState<Member[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [blocked, setBlocked] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useUser();
    const { URL, socket } = useSocket();
    // const { URL, room, setRoom, socket } = useSocket();

    console.log("CHATPROVIDER")

    useEffect(() => {
        console.log("USER", user)
        axios.get(`${URL}/chat/generalchat/${user.userName}`)
        .then((response: AxiosResponse) => { 
            setRoom(response.data)
            console.log("PUBLICROOM", response.data)
         })
        .catch((error: any) => { console.log(error) });
        setIsLoading(false);
    }, [user])



    const getMyChatRooms = async () => {
        try {
            const response = await axios.get(`${URL}/chat/channels/${user.userName}`);
            setChatRooms(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getMyDmRooms = async() => {
        try {
            const response = await axios.get(`${URL}/chat/contacts/${user.userName}`);
            setDmRooms(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllPublicRooms = async() => {
        // try {
            const response = await axios.get(`${URL}/chat/public`);
            return response.data as Room[]
        // } catch (error) {
        //     console.log(error)
        //     return [] as Room[]
        // }
    };

    const getBlocked = async() => {
        try {
            const response = await axios.get(`${URL}/users/blocked/${user.userName}`);
            setBlocked(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getMessages = async() => {
        try {
            const response = await axios.get(`${URL}/chat/messages/${room?.roomName}`);
            const filteredOnBlocked = response.data
                .filter((message: Message) => !blocked.some(blocked => blocked.userName === message.userName));
            setMessages(filteredOnBlocked); //add message created time to filter only after?
        } catch (error) {
            console.log(error);
        }
    };

    const createDmRoom = async(newContact: string): Promise<DmRoomUser> => {
        const sortedString = [user.userName, newContact].sort();
        const joinedNames = sortedString.join('');
        
        const newRoom: Room = {
            roomName: joinedNames,
            member: [user.userName, newContact],
            type: RoomType.DIRECTMESSAGE,
        };
        
        // try {
            const response = await axios.post<DmRoomUser>(`${URL}/chat/contact`, newRoom);
            setDmRooms(prev => [...prev, response.data]);
            socket.emit('newDmRoom', response.data.contact);
            return response.data as DmRoomUser;
        // } catch (error) {
        //     console.log(error);
        // }
    };
    
    const addRoomUser = async(addRoom: string, addUser: string) => {
        // try {
            const response = await axios.post(`${URL}/chat/roomuser/${addRoom}/${addUser}/${UserRole.MEMBER}`);
            return response.data as ChatRoomUser;
        // } catch (error) {
        //     console.log(error);
        // }
    }
    
    const updateRoomUser = async(updatedRoomUser: Member) => {
        try {
            const response = await axios
                .put<Member[]>(`${URL}/chat/roomuser/${room?.roomName}/${updatedRoomUser.userName}`, 
                updatedRoomUser
            );
        } catch (error) {
            console.log(error);
        }
    };

    const updateRoom = async(updatedRoom: Room) => {
        try {
            const response = await axios.put(`${URL}/chat/room`, updatedRoom);
            socket.emit('roomUpdate'); //send room?
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleUnreadMessage = async(roomName: string) => { // update unread messages and get chatroom || dmrooms
        const foundChatRoom = chatRooms.find(room => room.roomName === roomName);
        const foundDmRoom = dmRooms.find(room => room.roomName === roomName);
        
        if (foundChatRoom) {
            setChatRooms(prevChatRooms =>
                prevChatRooms.map(room =>
                    room.roomName === foundChatRoom.roomName
                    ? { ...room, unreadMessages: room.unreadMessages + 1 }
                    : room
                )
            );
        } else if (foundDmRoom) {
            setDmRooms(prevDmRooms =>
                prevDmRooms.map(room =>
                    room.roomName === foundDmRoom.roomName
                    ? { ...room, unreadMessages: room.unreadMessages + 1 }
                    : room
                )
            );
        }
    };

    const clearUnreadMessages = () => { //also api call to clear
        if (room) {

            room.unreadMessages = 0;
        }
    }

    const getRoomMembers = async() => {
        const response = await axios.get(`${URL}/chat/members/${room?.roomName}`);
        response.data.sort((a: Member, b: Member) => a.userName.localeCompare(b.userName));
        setMembers(response.data);
    }
    
    useEffect(() => {
        if (!room) return

        getMessages();
    }, [room, blocked])
    
    useEffect(() => {
        if (!room) return

        function onMemberUpdate() {
            getRoomMembers();
        };
    
        socket.on('onMemberUpdate', onMemberUpdate);

        getRoomMembers();
        clearUnreadMessages();

        return () => {
            socket.off('onMemberUpdate');
        }
    }, [room])
                
    useEffect(() => {	
        if (!room) return

        function onUserUpdate(users: User[]) {
            users.sort((a, b) =>  a.userName.localeCompare(b.userName));
            setAllUsers(users);
            socket.emit('memberUpdate', room?.roomName);
        };

        function onMemberInvite() {
            getMyChatRooms();
        };
        
        function onNewDmRoom() {
            getMyDmRooms();
        }
        
        socket.on('onUserUpdate', onUserUpdate);
        socket.on('onMemberInvite', onMemberInvite);
        socket.on('onNewDmRoom', onNewDmRoom);

        getMyChatRooms();
        getMyDmRooms();
        getBlocked();
        socket.emit('userUpdate');

        return () => {
            socket.off('onUserUpdate');
            socket.off('onMemberInvite');
            socket.off('onNewDmRoom');
        }
    }, [room]);
    
    // function onRoom
    // socket.on('onRoomUpdate', onRoomUpdate);

	const value = {
        room: room!,
        chatRooms,
        dmRooms,
        blocked,
        messages,
        allUsers,
        members,
        setRoom,
        setChatRooms,
        setDmRooms,
        setBlocked,
        setMessages,
        getAllPublicRooms,
        createDmRoom,
        addRoomUser,
        updateRoomUser,
        updateRoom,
        handleUnreadMessage,
	};
    

	return (
        <ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	)
}


// const getAllUsersStatus = async() => {
//     const response = await axios.get(`${URL}/users/status`);
//     setAllUsers(response.data);
// }

// const getRoomMembers = async() => {
//    const response = await axios.get<Member[]>(`${URL}/chat/members/${room.roomName}`);
//    const sortedMembers = response.data
//         .sort((a, b) =>  a.userName.localeCompare(b.userName))
//    setMembers(sortedMembers);
// };