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
import { AiOutlineUserAdd } from "react-icons/ai";

type Props = {
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const RoomInfo = ({ setSelectedMember }: Props) => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	const { user } = useUser();
	const { members, room } = useChat();
	
	const handleMemberClick = (member: Member) => {
		setSelectedMember(member);
	}

	return (
		<>
			{room.userRole === UserRole.OWNER &&
				<FormEditPassword />
			}
		<div>
			{(room.userRole === UserRole.OWNER ||
				room.userRole === UserRole.ADMIN) &&
				<button className="iconBtn" onClick={() => setPopupVisibility(!popupVisibility)}>
					<AiOutlineUserAdd size="2em" color="green"/>
					invite
				</button>
			}
			<div className="roomDescription">
				{room.description 
				? 
				<>
					<h5>Description</h5>
					{room.description}
				</>
				: null}
			</div>
			<h4>
				Members
			</h4>
			{popupVisibility &&
				<FormAddMember setPopupVisibility={setPopupVisibility} />
			}
			<ClickableList
				items={members}
				renderItem={(member) => (
					!member.isBanned ?
						<p className="memberList">
							<div>
								{member.userName !== user.userName &&
									<BlockButton member={member} /> 
								}
							</div>
							<div className="membersList avatar-status-wrapper">
								<img src={member.avatar} style={{margin:0,width:30, height:30, borderRadius:50}}/>
								{member.status === 'online' ?
								<span className="online-dot"></span> :
								<span className="offline-dot"></span>
								}
								{member.userName}
							</div >
							<div>
								{room.userRole === UserRole.OWNER && 
									member.userRole !== UserRole.ADMIN &&
									member.userName !== user.userName && 
									<AdminButton member={member}/>
								}
								{(room.userRole === UserRole.OWNER || 
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
							</div>
							<div className={`${member.userRole === UserRole.OWNER ? 'owner' 
								: member.userRole === UserRole.ADMIN ? 'admin' : ''}`}>
								{member.userRole === UserRole.OWNER ||
									member.userRole === UserRole.ADMIN 
									? member.userRole
									: null	
								}
							</div>
						</p>
					: <></>
				)}
				onClickItem={(member) => handleMemberClick(member)}
				/>
			</div>

			<div>
			{(room.userRole === UserRole.OWNER || room.userRole === UserRole.ADMIN) &&
				members.some(member => member.isBanned) &&
				<>
					<h5>Banned</h5>
					<ClickableList
						items={members}
						renderItem={(member) => (
							member.isBanned ?
								<p className={"memberList offline"}>
									<BlockButton member={member} />
									<div className="avatar-status-wrapper">
										<img src={member.avatar} style={{margin:0,width:30, height:30, borderRadius:50}}/>
										{member.status === 'online' ?
											<span className="online-dot"></span> :
											<span className="offline-dot"></span>
										}
										{member.userName}
									</div>
									<BanButton member={member}/>
								</p>
							: <></>
						)}
						onClickItem={(member) => handleMemberClick(member)}
					/>
				</>
			}	
			</div>
		</>
	)
}
