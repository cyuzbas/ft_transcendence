import { useChat } from "../../../contexts/ChatContext/provider";
import { DmRoomUser, Member } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts";

type Props = {
    selectedMember: Member | null,
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const UserInfo = ({ selectedMember, setSelectedMember }: Props) => {
  const { user } = useUser();
	const { dmRooms, createDmRoom, room: RoomUser, setRoom } = useChat();
  const room = RoomUser as DmRoomUser;

	const openConversation = async(userName: string) => {
		const dmRoom = dmRooms.find(dmRoom => dmRoom.contact === userName);
		if (dmRoom) {
			setRoom(dmRoom);
		} else {
			createDmRoom(userName);
		};
	}

	return (
		<>
			User Information
            {selectedMember &&
                <button onClick={() => setSelectedMember(null)}>back</button>
            }
            <div>
                {selectedMember?.userName}
                {room.contact}
            </div>
            {selectedMember && selectedMember.userName !== user.userName &&
                <button onClick={() => openConversation(selectedMember.userName)}>open conversation</button>
            }
			
		</>
	)
}
