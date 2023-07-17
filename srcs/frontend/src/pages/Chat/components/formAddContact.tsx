import { useEffect, useState } from "react";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType, User, UserRole, useUser } from "../../../contexts";
import { useSetupDmConversation } from "./hookSetupDm";
import { useSocket } from "../../../contexts/SocketContext";

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddContact = ({ setPopupVisibility }: addContactProps) => {
	const [unknowContacts, setUnknownContacts] = useState<User[]>([]);
	const setupDmConversation = useSetupDmConversation();
	const { allUsers, myRooms, createNewRoom, addRoomUser, setRoom, setMyRooms } = useChat();
	const { user } = useUser();
	const { socket } = useSocket();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(contact => !myRooms.some(room => room.contactName === contact.userName))
		.filter(contact => contact.userName !== user.userName)
		
		setUnknownContacts(filteredUsers);
	},[allUsers])

	const handleClick = async(newContact: User) => { // prevent e.default()?
		await setupDmConversation(newContact);
		setPopupVisibility(false);
	}

	return (
		<>
			Add Contact
			<button 
				type="button" 
				onClick={() => setPopupVisibility(false)}>
				X
			</button>
			<ClickableList
				items={unknowContacts}
				renderItem={(newContact) => (
					<p className={`roomListBtn ${newContact.status === 'online' ? 'online' : 'offline'}`}>
						<img src={newContact.avatar} className="image" style={{margin:0,width:30, height:25, borderRadius:20}}/>
						{newContact.userName} : {newContact.status}
					</p>
				)}
				onClickItem={(newContact) => handleClick(newContact)}
			/>
		</>
	)
}
