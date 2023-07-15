import { DmRoomUser, GENERAL_CHAT, RoomType, RoomUser } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";

type Props = {
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatHeader = ({ expanded, setExpanded }: Props) => {
	const { room, removeRoomUser } = useChat();

	function isDmRoomUser(room: RoomUser): room is DmRoomUser {
		return room.type === RoomType.DIRECTMESSAGE;
	};
	
	return (
		<div id="chat-header">
			<a className="roomBtn" onClick={() => setExpanded(!expanded)}>
				{isDmRoomUser(room) ? room.contact : `${room.roomName}`}
			</a>
			{room.roomName !== GENERAL_CHAT.roomName &&
				<button className="leaveChat-btn" onClick={() => removeRoomUser()}>
					{room.type !== RoomType.DIRECTMESSAGE ? "LEAVE CHANNEL" : "LEAVE CONVERSATION"}
				</button>
			}
		</div>
	)
}
