import { Member } from "../../../contexts/ChatContext/types"

export const MuteButton: React.FC<{ member: Member }> = ({ member }) => {
  return(
    <button>MUTE</button>
  )
}