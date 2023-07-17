import { Member, useChat } from "../../../contexts/ChatContext"

export const BanButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser } = useChat();

  function handleClick(e: React.MouseEvent, member: Member, banAction: boolean) {
    e.stopPropagation();

    updateRoomUser({
      ...member,
      isBanned: banAction,
    }, room.roomName);
  };

  return(
    member.isBanned 
    ? <button onClick={(e) => handleClick(e, member, false)}>UNBAN</button>
    : <button onClick={(e) => handleClick(e, member, true)}>BAN</button>
  )
}
