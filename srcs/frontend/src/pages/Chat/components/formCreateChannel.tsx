import { useState } from "react"
import { RoomType, UserRole } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";
import { useSocket } from "../../../contexts/SocketContext";

type createChannelProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormCreateChannel = ({ setPopupVisibility }: createChannelProps) => {
	const [type, setType] = useState<RoomType>(RoomType.PUBLIC);
	const [roomName, setRoomName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { setRoom, createNewRoom, addRoomUser, setMyRooms } = useChat();
	const { user } = useUser();
	const { socket } = useSocket();

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		
		await createNewRoom({
			roomName: roomName,
			type: type,
			description: description,
			password: password,
		});

		const newRoomUser = await addRoomUser({
			roomName: roomName, 
			userName: user.userName, 
			userRole: UserRole.OWNER,
		});

		if (newRoomUser) {
			setMyRooms(prev => [...prev, newRoomUser])
			setRoom(newRoomUser);
			socket.emit('joinRoom', roomName);
		};

		setPopupVisibility(false);
	}
	
	return (
		<>
			<form onSubmit={handleSubmit}>
				Create New Channel 
				<button 
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					X
				</button>
				<div>
					<label htmlFor="type">Type</label>
						<select id="type" onChange={(e) => setType(e.target.value as RoomType)}>
							<option value={RoomType.PUBLIC}>public</option>
							<option value={RoomType.PRIVATE}>private</option>
							<option value={RoomType.PROTECTED}>protected</option>
					</select>
				</div>
				<div className="popup-input">
					<input
						placeholder="name" 
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}/> 
				</div>
				<div>
					<textarea 
						rows={4}
						placeholder="optional: description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}/>
				</div>
				{type === 'protected' && (
					<div>
						<input 
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}/>
					</div>
				)}
				<button type="submit">CREATE</button>
			</form>
		</>
	)
}
