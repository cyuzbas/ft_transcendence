import axios from "axios";
import { GENERAL_CHAT, useSocket } from "../../../contexts/SocketContext/provider";
import { DmRoomUser, RoomType, RoomUser } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts/UserContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";

type Props = {
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatHeader = ({ expanded, setExpanded }: Props) => {
  const { URL, socket, room, setRoom } = useSocket();
	const { user } = useUser();
	const { setDmRooms, setChatRooms } = useChat();

	const handleLeaveRoom = async() => {
		const response = await axios.put(`${URL}/chat/remove/${room.roomName}/${user.userName}/${room.type}`);
		if (room.type === RoomType.DIRECTMESSAGE) {
			setDmRooms(response.data);
		} else {
			setChatRooms(response.data)
		};
	
		// also emit event leave room??
		socket.emit('newMessage', {
			userName: user.userName,
			content: `has left the chat...`,
			roomName: room.roomName,
		});
	
		setRoom(GENERAL_CHAT);
	}

	function isDmRoomUser(room: RoomUser): room is DmRoomUser {
		return room.type === RoomType.DIRECTMESSAGE;
	}
	
	return (
		<div id="chat-header">
			<a className="roomBtn" onClick={() => setExpanded(!expanded)}>
				{isDmRoomUser(room) ? room.contact : `${room.roomName}`}
			</a>
			{room.roomName !== GENERAL_CHAT.roomName &&
				<button className="leaveChat-btn" onClick={handleLeaveRoom}>
					{room.type !== RoomType.DIRECTMESSAGE ? "LEAVE CHANNEL" : "LEAVE CONVERSATION"}
				</button>
			}
		</div>
	)
}
