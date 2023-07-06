import { useEffect, useState } from "react";
// import { User, useUser } from "../../../contexts/UserContext/provider";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { BlockButton } from "./buttonBlock";
import { UnBlockButton } from "./buttonUnBlock";
import { Member } from "../../../contexts/ChatContext/types";
import { AddAdminButton } from "./buttonAddAdmin";
import { User } from "../../../contexts";

export const RoomInfo = () => {
	const { socket } = useSocket();
	const { room, setRoom } = useSocket();
	const { dmRooms, setDmRooms, createDmRoom, members, setMembers } = useChat();
		
	
	useEffect(() => {
		function onMemberStatus(members: Member[]) {
			members.sort((a, b) => a.userName.localeCompare(b.userName))
			setMembers(members);
		};
		
		function onUserStatus() { // have to change this
			socket.emit('getMemberStatus', room)
		};

		socket.on('memberStatus', onMemberStatus);
		socket.on('userStatus', onUserStatus);
		
		return () => {
			socket.off('memberStatus');
			socket.off('userStatus');
		}
	}, [room, socket])
	
	const openConversation = async(member: User) => {
		const dmRoom = dmRooms.find(dmRoom => dmRoom.contact === member.userName);
		if (dmRoom) {
			setRoom(dmRoom);
		} else {
			const newDmRoom = await createDmRoom(member.userName);
			setDmRooms(prev => [...prev, newDmRoom]);
			setRoom(newDmRoom);
			socket.emit('newDmRoom', newDmRoom);
		};
	}

	return (
		<>
			Room Information
			<h3>Members</h3>
			<ClickableList
				items={members}
				renderItem={(member) => (
					<p className={`roomListBtn ${member.status === 'online' ? 'online' : 'offline'}`}>
						<BlockButton member={member} />
						<UnBlockButton member={member} />
						{member.userName} : {member.userRole}
						<AddAdminButton member={member}/>
					</p>
				)}
				onClickItem={(member) => openConversation(member)}
				/>
		</>
	)
}
