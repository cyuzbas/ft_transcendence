import { useChat } from "../../../contexts";
import { Member } from "../../../contexts/ChatContext/types"
import { useMuteTimer } from "./hookMuteTimer";

export const MuteButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser } = useChat();
  const muteRemaining = useMuteTimer({ ...room, ...member })

  function handleClick(e: React.MouseEvent, member: Member, muteAction: boolean) {
    e.stopPropagation();
    const muteDuration = 10;
    const muteEndTime = new Date(Date.now() + muteDuration * 1000);

    updateRoomUser({
      ...member,
      isMuted: muteAction,
      muteEndTime,
    }, room.roomName)
  }

  return(
    muteRemaining > 0
    ? 
      ( 
        <>
        <button onClick={(e) => handleClick(e, member, false)}>UNMUTE</button>
        {muteRemaining} sec remaining
        </>
      ) 
    : <button onClick={(e) => handleClick(e, member, true)}>MUTE</button>
  )
}
