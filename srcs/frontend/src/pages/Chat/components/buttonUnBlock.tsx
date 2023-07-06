import axios from "axios";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useUser } from "../../../contexts/UserContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { Member, User } from "../../../contexts/ChatContext/types";

export const UnBlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { user } = useUser();
	const { URL } = useSocket();
	const { blocked, setBlocked } = useChat();

	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);

	const handleClick = async(e: React.MouseEvent, member: User) => {
		e.stopPropagation();
		const response = await axios.put(`${URL}/user/unblock/${user.userName}/${member.userName}`);
		setBlocked(response.data);
	};

	return (
		isBlocked ? <button onClick={(e) => handleClick(e, member)}>UNBLK</button> : null
	)
}