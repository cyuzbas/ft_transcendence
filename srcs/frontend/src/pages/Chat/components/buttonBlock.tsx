import axios from "axios";
// import { useSocket } from "../../../contexts/SocketProvider";
// import { useUser } from "../../../contexts/UserProvider";
// import { useChat } from "../chat.provider";
// import { RoomUser, User } from "../chat.types";

import { User, useUser } from "../../../contexts";
import { useChat } from "../../../contexts/ChatContext";
import { useSocket } from "../../../contexts/SocketContext";

export const BlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { user } = useUser();
	const { URL } = useSocket();
	const { blocked, setBlocked } = useChat();

	async function handleClick(e: React.MouseEvent, member: User){
		e.stopPropagation();
		await axios.put(`${URL}/users/block/${user.userName}/${member.userName}`);// maybe return entire array for unblocked?
		setBlocked(prev => [...prev, member]);
		console.log('blocking', member.userName)
		//emit blocked
	};
	
	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);
	
	return (
		isBlocked ? null : <button onClick={(e) => handleClick(e, member)}>BLOCK</button>
	)
}
