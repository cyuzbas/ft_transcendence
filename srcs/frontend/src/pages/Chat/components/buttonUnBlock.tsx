import axios from "axios";
import { useSocket } from "../../../contexts/SocketContext/provider";
// import { useUser } from "../../../contexts/UserProvider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { Member } from "../../../contexts/ChatContext/types";
import { User, useUser } from "../../../contexts";

export const UnBlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { user } = useUser();
	const { URL } = useSocket();
	const { blocked, setBlocked } = useChat();

	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);

	const handleClick = async(e: React.MouseEvent, member: User) => {
		e.stopPropagation();
		const response = await axios.put(`${URL}/users/unblock/${user.userName}/${member.userName}`);
		setBlocked(response.data);
		//emit unblock
	};

	return (
		isBlocked ? <button onClick={(e) => handleClick(e, member)}>UNBLK</button> : null
	)
}