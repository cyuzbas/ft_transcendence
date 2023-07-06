import { useEffect, useState } from "react"
import { Room, RoomType, RoomUser, UserRole } from "../../../contexts/ChatContext/types";
import axios from "axios"
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useUser } from "../../../contexts/UserContext/provider";
import { ClickableList } from "./clickableList"
import { useChat } from "../../../contexts/ChatContext/provider";

type Props = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormJoinChannel = ({ setPopupVisibility }: Props) => {
    const [joinableRooms, setJoinableRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [isProtected, setIsProtected] = useState<boolean>(false);
    const [value, setValue] = useState<string>('')
    const { URL, setRoom } = useSocket();
    const { user } = useUser();
    const { chatRooms, setChatRooms } = useChat();

    const filterOutKnownRooms = (data: Room[]) => { //do in backend? with roomuser now?
        const filterdata = data
            .filter(room => !chatRooms.some(userRoom => userRoom.roomName === room.roomName)) // also weird
        return filterdata;
    }

    useEffect(() => {
        const getJoinableRooms = async() => {
            const response = await axios.get(`${URL}/chat/public`);
            const filteredData = filterOutKnownRooms(response.data);
            setJoinableRooms(filteredData);
        };
    
    	getJoinableRooms();
    },[])

    const addRoomUser = async(room: Room) => {
        const response = await axios.post(`${URL}/chat/roomuser/${room.roomName}/${user.userName}/${UserRole.MEMBER}`);
        setChatRooms(prevRooms => [...prevRooms, response.data]);
        setRoom(response.data);
        setPopupVisibility(false);
    }

    const handleRoomListClick = (room: Room) => {
        if (room.type === RoomType.PROTECTED) {
            setSelectedRoom(room);
            setIsProtected(true);
        } else {
            addRoomUser(room);
        }
    }

    const handlePasswordSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRoom) {
            const response = await axios.post('http://localhost:3001/chat/password', {
                roomName: selectedRoom.roomName,
                type: RoomType.PROTECTED, // is necessary for RoomDto, make another for this?
                password: value
            })
            if (response.data === false) {
                alert('incorrect password, try again');
                setValue('');
            } else {
                addRoomUser(selectedRoom);
            }
        }
    }

    return (
        <>
            Join existing channel
            <ClickableList
                items={joinableRooms}
                renderItem={room => <p className="roomListBtn">{room.roomName} - {room.type}</p>}
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
        </>
    )
}
