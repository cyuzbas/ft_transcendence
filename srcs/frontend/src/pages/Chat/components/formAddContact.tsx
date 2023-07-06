import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext/provider";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User } from "../../../contexts/ChatContext/types";

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddContact = ({ setPopupVisibility }: addContactProps) => {
	const [newContacts, setNewContacts] = useState<User[]>([]);
	const { socket, setRoom } = useSocket();
	const { dmRooms, setDmRooms, createDmRoom } = useChat();
	const { user } = useUser();

	const sortAndFilterKnownContact = (data: User[]) => {
		const sorteddata = data
		.filter(contact => !dmRooms.some(room => room.contact === contact.userName))
		.filter(contact => contact.userName !== user.userName)
		.sort((a, b) =>  a.userName.localeCompare(b.userName))
		return sorteddata;
	} 

	useEffect(() => {
		function onUserStatus(data: User[]) {
			const sortedData = sortAndFilterKnownContact(data);
			setNewContacts(sortedData);
		}
		socket.emit('getUserStatus');
		socket.on('userStatus', onUserStatus);
		return () => {
			socket.off('userStatus');
		}
	},[socket])

	const handleClick = async(newContact: User) => {
		const newDmRoom = await createDmRoom(newContact.userName);
		setDmRooms(prev => [...prev, newDmRoom]); //put in provider
		setRoom(newDmRoom);
		socket.emit('newDmRoom', newDmRoom);
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
				items={newContacts}
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
