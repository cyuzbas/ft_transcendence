import axios from "axios";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useUser } from "../../../contexts/UserContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomUser, User } from "../../../contexts/ChatContext/types";

export const BlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { user } = useUser();
	const { URL } = useSocket();
	const { blocked, setBlocked } = useChat();

	async function handleClick(e: React.MouseEvent, member: User){
		e.stopPropagation();
		await axios.put(`${URL}/user/block/${user.userName}/${member.userName}`);// maybe return entire array for unblocked?
		setBlocked(prev => [...prev, member]);
	};
	
	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);

	return (
		isBlocked ? null : <button onClick={(e) => handleClick(e, member)}>BLOCK</button>
	)
}