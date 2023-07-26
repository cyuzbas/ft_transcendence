import { useState } from "react"
import { RoomType, UserRole } from "../../../contexts/ChatContext/types";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";
import { useSocket } from "../../../contexts/SocketContext";
import { AiOutlineClose } from "react-icons/ai"


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
			contactName: null,
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
			<form className="createChannel-form" onSubmit={handleSubmit}>
				<h4 className="formTitle">
					Create New Channel 
					</h4>
				<button className="iconBtn formCloseBtn"
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					<AiOutlineClose size="2em"/>
				</button>
				<div>
					{/* <label htmlFor="type">Type</label> */}
						<select className="form-input" id="type" onChange={(e) => setType(e.target.value as RoomType)}>
							<option value="" disabled selected>Select type</option>
							<option value={RoomType.PUBLIC}>public</option>
							<option value={RoomType.PRIVATE}>private</option>
							<option value={RoomType.PROTECTED}>protected</option>
					</select>
				</div>
				<div >
					<p>
						Channel Name
						</p>
					<input
						required
						placeholder="Enter Name" 
						value={roomName}
						onChange={(e) => setRoomName(e.target.value.trim())}/> 
				</div>
				<div>
					<p>
						Description
						</p>
					<textarea 
						rows={4}
						placeholder="Enter Description: optional"
						value={description}
						onChange={(e) => setDescription(e.target.value)}/>
				</div>
				{type === 'protected' && (
					<div>
						<input 
							required
							placeholder="Enter Password"
							value={password}
							onChange={(e) => setPassword(e.target.value.trim())}/>
					</div>
				)}
				<button className="formBtn" type="submit">
					CREATE
				</button>
			</form>
		</>
	)
}
