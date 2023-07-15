import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { BlockButton } from "./buttonBlock";
import { UnBlockButton } from "./buttonUnBlock";
import { AddAdminButton } from "./buttonAddAdmin";
import { useEffect, useState } from "react";
import { FormAddMember } from "./formAddMember";
import { ChatRoomUser, Member, RoomType, RoomUser, UserRole } from "../../../contexts/ChatContext/types";
import { BanButton } from "./buttonBan";
import { KickButton } from "./buttonKick";
import { MuteButton } from "./buttonMute";
import { FormEditPassword } from "./formEditPassword";
import { useUser } from "../../../contexts";

type Props = {
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const RoomInfo = ({ setSelectedMember }: Props) => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	const [settings, setSettings] = useState<boolean>(false);
	const { user } = useUser();
	const { members, room: RoomUser } = useChat();
	const room = RoomUser as ChatRoomUser;
	
	const handleMemberClick = (member: Member) => {
		setSelectedMember(member);
	}

	useEffect(() => {
		setSettings(false);
	}, [room])

	return (
		<>
			Room Information {room.roomName}
			<h3>
				Members
				{(room.userRole === UserRole.OWNER || room.userRole === UserRole.ADMIN) &&
					<button onClick={() => setSettings(!settings)}>
						Settings
					</button>
				}
			</h3>
				<div>
				{settings && (room.userRole === UserRole.OWNER ||
					room.userRole === UserRole.ADMIN) &&
					<button onClick={() => setPopupVisibility(!popupVisibility)}>
						Invite Member
					</button>
				}
				{settings && room.userRole === UserRole.OWNER &&
					<FormEditPassword />
				}
				</div>
			{popupVisibility &&
			<div className="chat-popup">
				<FormAddMember setPopupVisibility={setPopupVisibility} />
			</div>
			}
			<ClickableList
				items={members}
				renderItem={(member) => (
					<p className={`roomListBtn ${member.status === 'online' ? 'online' : 'offline'}`}>
						{member.userName !== user.userName &&
							<>
								<BlockButton member={member} /> 
								<UnBlockButton member={member} />
							</>
						}
						{member.userName} : {member.userRole !== UserRole.MEMBER && member.userRole}
						{settings && room.userRole === UserRole.OWNER && 
							member.userRole !== UserRole.ADMIN &&
							member.userName !== user.userName && 
								<AddAdminButton member={member}/>
						}
						{settings && (room.userRole === UserRole.OWNER || 
							room.userRole === UserRole.ADMIN) &&
							member.userRole !== UserRole.OWNER &&
							member.userRole !== UserRole.ADMIN &&
							member.userName !== user.userName &&
							<>
								<BanButton member={member} />
								<KickButton member={member} />
								<MuteButton member={member} />
							</>
						}
					</p>
				)}
				onClickItem={(member) => handleMemberClick(member)}
				/>
		</>
	)
}








// useEffect(() => {
// 	function onMemberStatus(members: Member[]) {
// 		members.sort((a, b) => a.userName.localeCompare(b.userName))
// 		setMembers(members);
// 	};
	
// 	function onUserStatus() { // have to change this
// 		socket.emit('getMemberStatus', room)
// 	};

// 	socket.on('memberStatus', onMemberStatus);
// 	socket.on('userStatus', onUserStatus);		
// 	return () => {
// 		socket.off('memberStatus');
// 		socket.off('userStatus');
// 	}
// }, [room, socket])