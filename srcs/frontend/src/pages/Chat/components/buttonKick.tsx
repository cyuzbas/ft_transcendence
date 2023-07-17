import { useChat } from "../../../contexts";
import { Member } from "../../../contexts/ChatContext/types"

export const KickButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser, removeRoomUser } = useChat();
  const handleClick = async(e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    
    removeRoomUser(room.roomName, member.userName, member.intraId);
    // console.log("here")
    // updateRoomUser({
    //   ...member,
    //   isKicked: true,
    // }, room.roomName)
  };

  return(
    <button onClick={(e) => handleClick(e, member)}>KICK</button>
  )
}