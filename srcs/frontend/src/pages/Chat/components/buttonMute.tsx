import { useChat } from "../../../contexts";
import { Member } from "../../../contexts/ChatContext/types"
import { useSocket } from "../../../contexts/SocketContext";
import { useMuteTimer } from "./hookMuteTimer";
import { BiSolidUserVoice } from "react-icons/bi"
import { GoMute, GoUnmute } from "react-icons/go"

export const MuteButton: React.FC<{ member: Member }> = ({ member }) => {
  const { room, updateRoomUser } = useChat();
  const muteRemaining = useMuteTimer(member, room.roomName)
  // const muteRemaining = useMuteTimer({ ...room, ...member })
  const { socket } = useSocket()

  async function handleClick(e: React.MouseEvent, member: Member, muteAction: boolean) {
    e.stopPropagation();
    const muteDuration = 60;
    const muteEndTime = new Date(Date.now() + muteDuration * 1000);

    await updateRoomUser({
      ...member,
      isMuted: muteAction,
      muteEndTime,
    }, room.roomName);
    socket.emit('memberUpdate', room.roomName); //not for unreadmessages
    
  }

  return(
    muteRemaining > 0
    ? 
      ( 
        <>
        <button className="iconBtn" onClick={(e) => handleClick(e, member, false)}
            // style={{
            // backgroundImage: 'linear-gradient(to right, purple, red)', 
            // backgroundSize: `${muteRemaining / 60 * 100}%`,
            // backgroundRepeat: 'no-repeat',
            // transition: 'all 1s ',
            // borderRadius: '50%',
            // padding: '5px',
            // display: 'flex',
            // // justifyContent: 'center',
            // // alignItems: 'center'
            // // fontSize: '5px',
            // }}
        >
          {/* <div className="iconContainer"> */}
          {/* <GoMute size="2em" /> */}
          <BiSolidUserVoice size="2em" color="grey" />
          {/* <span className="line-through line1"></span> */}
          {/* <span className="line-through line2"></span>           */}
          {/* </div> */}
        <span style={{fontSize: '10px'}}>
          {Math.floor(muteRemaining)}

        </span>
        </button>
        </>
      ) 
    : <button className="iconBtn" onClick={(e) => handleClick(e, member, true)}>
        {/* <GoUnmute size="2em" /> */}
        <BiSolidUserVoice size="2em" />
      </button>
  )
}
