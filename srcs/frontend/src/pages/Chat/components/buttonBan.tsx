import { Member, useChat } from "../../../contexts/ChatContext"

export const BanButton: React.FC<{ member: Member }> = ({ member }) => {
  const { updateRoomUser } = useChat();

  function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    updateRoomUser({
      ...member,
      isBanned: true,
    });
  };

  return(
    <button onClick={(e) => handleClick(e, member)}>BAN</button>
  )
}