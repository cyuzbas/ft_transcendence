import axios from "axios"
import { useEffect, useState } from "react"
import { Room, RoomType, UserRole } from "../../../contexts/ChatContext/types"
import { ClickableList } from "./clickableList"
import { useChat } from "../../../contexts/ChatContext/provider"
import { useUser } from "../../../contexts"
import { useSocket } from "../../../contexts/SocketContext"
import { Prompt } from "./prompt"

type Props = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormJoinChannel = ({ setPopupVisibility }: Props) => {
    const [joinableRooms, setJoinableRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [isProtected, setIsProtected] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<boolean>(false);
    const [promptText, setPromptText] = useState<string>('');
    const [value, setValue] = useState<string>('')
    const { setRoom, myRooms, setMyRooms, fetchPublicRooms, publicRooms, addRoomUser, updateRoomUser } = useChat();
    const { user } = useUser();
    const { socket, URL } = useSocket();
        
    useEffect(() => {
        fetchPublicRooms();
    }, [])

    useEffect(() => { // do with gateway?
        const getJoinableRooms = () => {
            const filteredRooms = publicRooms.filter(publicRoom => {
                const myRoom = myRooms.find(myRoom => myRoom.roomName === publicRoom.roomName);
                if (!myRoom) {
                    return true;
                } else {
                    return myRoom.isBanned// || myRoom.isKicked;
                }
            });
            setJoinableRooms(filteredRooms);
        };
    	getJoinableRooms();
    },[publicRooms, myRooms])

    const joinRoom = async(room: Room) => {
        const newRoomUser = await addRoomUser({
            roomName: room.roomName, 
            userName: user.userName, 
            userRole: UserRole.MEMBER,
        });
        
        if (newRoomUser) {
            if (newRoomUser.isBanned) {
                setPromptText('You are banned from this channel');
                setPrompt(true);
                return
            } 
            // else if (newRoomUser.isKicked) {
            //     await updateRoomUser({
            //         ...user,
            //         ...newRoomUser,
            //         isKicked: false,
            //     }, room.roomName);
            //     setRoom({...newRoomUser, isKicked: false});
            //     // socket.emit('joinRoom', room.roomName);
            //     setPopupVisibility(false);
            //     return
            // }
			setMyRooms(prev => [...prev, newRoomUser]);
            setRoom(newRoomUser);
            socket.emit('joinRoom', room.roomName);
        }
        setPopupVisibility(false);
    }

    const handleRoomListClick = (room: Room) => {
        if (room.type === RoomType.PROTECTED) {
            setSelectedRoom(room);
            setIsProtected(true);
        } else {
            joinRoom(room);
        }
    }

    const handlePasswordSubmit = async(e: React.FormEvent) => { //make try catch block
        e.preventDefault();
        if (selectedRoom) {
            const response = await axios.post(`${URL}/chat/password`, {
                roomName: selectedRoom.roomName,
                type: RoomType.PROTECTED,
                password: value
            })
            if (response.data === false) {
                alert('incorrect password, try again');
                setValue('');
            } else {
                joinRoom(selectedRoom);
            }
        }
    }

    return (
        <>
            Join existing channel
            <ClickableList
                items={joinableRooms}
                renderItem={room => 
                    <p className="roomListBtn">
                        {room.roomName} - {room.type}
                    </p>}
                onClickItem={room => handleRoomListClick(room)}
            />
            {isProtected && 
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        placeholder="password"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        />
                    <button>SUBMIT</button>
                </form>
            }
            {prompt &&
                <Prompt
                    promptText={promptText}
                    setPrompt={setPrompt}
                />
            }
        </>
    )
}
