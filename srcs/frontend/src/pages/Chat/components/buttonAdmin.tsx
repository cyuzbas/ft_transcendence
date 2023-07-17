import { Member, UserRole, useChat } from "../../../contexts/ChatContext";

export const AdminButton: React.FC<{ member: Member }> = ({ member }) => { //send event to addamin? to update realtime settings option
  const { room, updateRoomUser } = useChat();

  function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    updateRoomUser({
      ...member,
      userRole: UserRole.ADMIN,
    }, room.roomName);
  };

  return (
    <button onClick={(e) => handleClick(e, member)}>Admin+</button>
  )
}
