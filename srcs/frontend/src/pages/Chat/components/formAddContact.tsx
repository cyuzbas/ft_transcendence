import { useEffect, useState } from "react";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User, useUser } from "../../../contexts";

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddContact = ({ setPopupVisibility }: addContactProps) => {
	const [unknowContacts, setUnknownContacts] = useState<User[]>([]);
	const { setRoom, allUsers, dmRooms, createDmRoom } = useChat();
	const { user } = useUser();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(contact => !dmRooms.some(room => room.contact === contact.userName))
		.filter(contact => contact.userName !== user.userName)
		
		setUnknownContacts(filteredUsers);
	},[allUsers])

	const handleClick = async(newContact: User) => { // prevent e.default()?
		createDmRoom(newContact.userName);
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
						{newContact.userName} : {newContact.status}
					</p>
				)}
				onClickItem={(newContact) => handleClick(newContact)}
			/>
		</>
	)
}

