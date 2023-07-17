import { User } from "../../../contexts";
import { useChat } from "../../../contexts/ChatContext";

export const BlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { blocked, handleBlock } = useChat();

	const handleClick = async(e: React.MouseEvent, member: User, blockAction: string) => {
		e.stopPropagation();
		await handleBlock(member, blockAction);
	};
	
	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);
	
	return (
		isBlocked 
		? <button onClick={(e) => handleClick(e, member, "unblock")}>UNBLOCK</button> 
		: <button onClick={(e) => handleClick(e, member, "block")}>BLOCK</button>
	)
}
