import { useChat } from "../../../contexts/ChatContext/provider";
import { Member, RoomType } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts";
import { useSetupDmConversation } from "./hookSetupDm";
import { BlockButton } from "./buttonBlock";
import { useEffect } from "react";

type Props = {
  selectedMember: Member | null,
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const UserInfo = ({ selectedMember, setSelectedMember }: Props) => {
  const { user } = useUser();
	const { myRooms, room, setRoom, members } = useChat();
	const setupDmConversation = useSetupDmConversation();

	const openConversation = async(member: Member) => {
		const existingRoom = myRooms.find(room => room.contactName === member.userName);
		if (existingRoom) {
			setRoom(existingRoom);
		} else {
			await setupDmConversation(member);
		}
	}

	useEffect(() => {
		if (room.type === RoomType.DIRECTMESSAGE) {
			const contact = members.find(member => member.userName !== user.userName);
			if (contact) {
				setSelectedMember(contact);
				// console.log('yes')
			} else {
				setSelectedMember(null);
				// console.log('no')
			}
		}
	}, [members])

	return (
		<>
			User Information
			{room.type !== RoomType.DIRECTMESSAGE &&
        <button onClick={() => setSelectedMember(null)}>
					back
				</button>
			}
			<div>
					{selectedMember?.userName}
			</div>
			{selectedMember &&
			<img src={selectedMember.avatar} className="image" style={{margin:5,width:200, height:150, borderRadius:20}}/>
			}
			{selectedMember && 
				selectedMember.userName !== user.userName &&
				<div>
					<BlockButton member={selectedMember}/>
				</div>
			}
			{selectedMember 
				&& selectedMember.userName !== user.userName 
				&& room.type !== RoomType.DIRECTMESSAGE 
				&& <button onClick={() => openConversation(selectedMember)}>
						open conversation
					</button>
			}
		</>
	)
}
