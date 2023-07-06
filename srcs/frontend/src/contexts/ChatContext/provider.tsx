import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import axios from "axios";
import { ChatRoomUser, DmRoomUser, Member, Message, Room, RoomType, User } from "./types";
import { useSocket } from "../SocketContext/provider";
import { UserContext } from '../../contexts';

export type ChatContextValue = {
    chatRooms: ChatRoomUser[],
    dmRooms: DmRoomUser[],
    blocked: User[],
    messages: Message[],
    members: Member[],
    setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomUser[]>>,
    setDmRooms: React.Dispatch<React.SetStateAction<DmRoomUser[]>>,
    setBlocked: React.Dispatch<React.SetStateAction<User[]>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>,
    createDmRoom: (newContact: string) => Promise<DmRoomUser>,
    updateRoomUser: (updatedRoomUser: Member) => Promise<void>,
    handleUnreadMessage: (roomName: string) => Promise<void>
};

const ChatContext = createContext({} as ChatContextValue);

export function useChat() {
	return useContext(ChatContext);
}

export function ChatProvider({ children }: {children: ReactNode}) {
    const [chatRooms, setChatRooms] = useState<ChatRoomUser[]>([]);
    const [dmRooms, setDmRooms] = useState<DmRoomUser[]>([]);
    const [members, setMembers] = useState<Member[]>([])
    const [blocked, setBlocked] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const {user} = useContext(UserContext)
    const { URL, room } = useSocket();

    
    console.log("asfkasflaskfjalsfa " + user.userName + "]")
    useEffect(() => {
		const getChatRooms = async () => {
			const response = await axios.get(`${URL}/chat/channels/${user.userName}`);
			setChatRooms(response.data);
		};
    
        const getDmRooms = async() => {
            const response = await axios.get(`${URL}/chat/contacts/${user.userName}`);
            setDmRooms(response.data);
        };

        const getBlocked = async() => {
            const response = await axios.get(`${URL}/user/blocked/${user.userName}`);
            setBlocked(response.data);
        };

		// getChatRooms();
        // getDmRooms();
        // getBlocked();
	}, [user]);

    useEffect(() => {
        const getMessages = async() => {
            const response = await axios.get(`${URL}/chat/messages/${room.roomName}`);
            const filteredOnBlocked = response.data
                .filter((message: Message) => !blocked.some(blocked => blocked.userName === message.userName));
            setMessages(filteredOnBlocked); //filter out blocked //add message created time to filter only after?
        };

        const getRoomMembers = async() => {
           const response = await axios.get<Member[]>(`${URL}/chat/members/${room.roomName}`);
           const sortedMembers = response.data
                .sort((a, b) =>  a.userName.localeCompare(b.userName))
           setMembers(sortedMembers);
        };
    
        // getMessages();
        // getRoomMembers();
    }, [room])

    const createDmRoom = async(newContact: string): Promise<DmRoomUser> => {
        const sortedString = [user.userName, newContact].sort();
        const joinedNames = sortedString.join('');
    
        const newRoom: Room = {
            roomName: joinedNames,
            member: [user.userName, newContact],
            type: RoomType.DIRECTMESSAGE,
        };
    
        const response = await axios.post<DmRoomUser>(`http://localhost:3001/chat/contact`, newRoom);
        return response.data as DmRoomUser;
    };

    const updateRoomUser = async(updatedRoomUser: Member) => {
        const response = await axios
            .put<Member[]>(`${URL}/chat/roomuser/${room.roomName}/${updatedRoomUser.userName}`, updatedRoomUser);
    };

    const handleUnreadMessage = async(roomName: string) => {
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
    
	const value = {
        chatRooms,
        dmRooms,
        blocked,
        messages,
        members,
        setChatRooms,
        setDmRooms,
        setBlocked,
        setMessages,
        createDmRoom,
        setMembers,
        updateRoomUser,
        handleUnreadMessage,
	};

	return (
		<ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	)
}
