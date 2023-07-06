import { Member, UserRole } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useSocket } from "../../../contexts/SocketContext/provider";

export const AddAdminButton: React.FC<{ member: Member }> = ({ member }) => {
  const { socket, room } = useSocket();
  const { updateRoomUser } = useChat();

  async function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    await updateRoomUser({
      ...member,
      userRole: UserRole.ADMIN,
    });

    socket.emit('memberUpdate', room.roomName);
  };

  return (
    <button onClick={(e) => handleClick(e, member)}>Admin+</button>
  )
}
