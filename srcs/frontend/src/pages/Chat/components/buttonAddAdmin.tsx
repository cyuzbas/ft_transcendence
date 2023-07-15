// import { Member, UserRole } from "../chat.types";
// import { useChat } from "../chat.provider";
// import { useSocket } from "../../../contexts/SocketProvider";
import { Member, UserRole, useChat } from "../../../contexts/ChatContext";
import { useSocket } from "../../../contexts/SocketContext";

export const AddAdminButton: React.FC<{ member: Member }> = ({ member }) => { //send event to addamin? to update realtime settings option
  const { socket } = useSocket();
  const { room, updateRoomUser } = useChat();

  function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    updateRoomUser({
      ...member,
      userRole: UserRole.ADMIN,
    });
  };

  return (
    <button onClick={(e) => handleClick(e, member)}>Admin+</button>
  )
}
