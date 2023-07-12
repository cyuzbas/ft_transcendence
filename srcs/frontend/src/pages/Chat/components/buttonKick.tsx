import { Member } from "../../../contexts/ChatContext/types"

export const KickButton: React.FC<{ member: Member }> = ({ member }) => {
  return(
    <button>KICK</button>
  )
}