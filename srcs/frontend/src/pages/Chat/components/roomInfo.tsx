import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { BlockButton } from "./buttonBlock";
import { AdminButton } from "./buttonAdmin";
import { useState } from "react";
import { FormAddMember } from "./formAddMember";
import { Member, UserRole } from "../../../contexts/ChatContext/types";
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
	const { members, room } = useChat();
	
	const handleMemberClick = (member: Member) => {
		setSelectedMember(member);
	}

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
					!member.isBanned && !member.isKicked ?
						<p className={`memberList ${member.status === 'online' ? 'online' : 'offline'}`}>
							<img src={member.avatar} className="image" style={{margin:0,width:30, height:25, borderRadius:20}}/>
							{member.userName}
							{member.userName !== user.userName &&
								<BlockButton member={member} /> 
							}
							{settings && room.userRole === UserRole.OWNER && 
								member.userRole !== UserRole.ADMIN &&
								member.userName !== user.userName && 
								<AdminButton member={member}/>
							}
							{settings && (room.userRole === UserRole.OWNER || 
								(room.userRole === UserRole.ADMIN) &&
								member.userRole !== UserRole.OWNER &&
								member.userRole !== UserRole.ADMIN) &&
								member.userName !== user.userName &&
								<>
									<BanButton member={member} />
									<KickButton member={member} />
									<MuteButton member={member} />
								</>
							}
						</p>
					: <></>
				)}
				onClickItem={(member) => handleMemberClick(member)}
				/>
			{settings && (room.userRole === UserRole.OWNER || room.userRole === UserRole.ADMIN) &&
				<>
					<h3>Banned</h3>
					<ClickableList
						items={members}
						renderItem={(member) => (
							member.isBanned ?
								<p className={`memberList ${member.status === 'online' ? 'online' : 'offline'}`}>
									<img src={member.avatar} className="image" style={{margin:0,width:30, height:25, borderRadius:20}}/>
									{member.userName}
									<BlockButton member={member} /> 
									<BanButton member={member}/>
								</p>
							: <></>
						)}
						onClickItem={(member) => handleMemberClick(member)}
					/>
				</>
			}	
			{/* {settings && (room.userRole === UserRole.OWNER || room.userRole === UserRole.ADMIN) &&
				<>
					<h3>Recently Kicked</h3>
					<ClickableList
						items={members}
						renderItem={(member) => (
							member.isKicked ?
								<p className={`roomListBtn ${member.status === 'online' ? 'online' : 'offline'}`}>
									<img src={member.avatar} className="image" style={{margin:0,width:30, height:25, borderRadius:20}}/>
									{member.userName} : {member.userRole}
									<BlockButton member={member} /> 
								</p>
							: <></>
						)}
						onClickItem={(member) => handleMemberClick(member)}
					/>
				</>
			}	 */}
		</>
	)
}
