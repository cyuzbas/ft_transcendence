import { useEffect, useState } from "react";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User, UserRole, useUser } from "../../../contexts";

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddMember = ({ setPopupVisibility }: addContactProps) => {
	const [unknowMembers, setUnknownMembers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const { allUsers, members, addRoomUser } = useChat();
	const { socket } = useSocket();
	const { user } = useUser();
	const { room } = useChat();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(users => !members.some(member => member.userName === users.userName))
		.filter(users => users.userName !== user.userName) // filter out my username in provider?
		
		setUnknownMembers(filteredUsers);
	},[allUsers])

	const handleCheckBoxChange = (user: User, isChecked: boolean) => {
		if (isChecked) {
			setSelectedUsers(prev => [...prev, user])
		} else {
			setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.userName !== user.userName))
		}
	};

  const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		
		for (const selectedUser of selectedUsers) {
			const newRoomUser = await addRoomUser({
				roomName: room.roomName,
				userName: selectedUser.userName,
				userRole: UserRole.MEMBER,
			});

			socket.emit('roomInvite', {
				...newRoomUser,
				intraId: selectedUser.intraId, 
				// roomName: room.roomName,
				// userName: selectedUser.userName,
				// userRole: UserRole.MEMBER,
			});
		};
		
		setPopupVisibility(false);
  }

	return (
		<form onSubmit={handleSubmit}>
			Invite Member
			<button type="button" onClick={() => setPopupVisibility(false)}>
				X
			</button>
      {unknowMembers.map((user, index) => (
        <div key={index}>
					<p className={`${user.status === 'online' ? 'online' : 'offline'}`}>
						<label className="roomListBtn">
						<img src={user.avatar} className="image" style={{margin:0,width:30, height:25, borderRadius:20}}/>
							{user.userName}
							<input
								type="checkbox"
								onChange={(e) => handleCheckBoxChange(user, e.target.checked)}
							/>
						</label>
					</p>
        </div>
      ))}
			<div>
				<button type="submit">ADD</button>
			</div>
		</form>
	)
}
