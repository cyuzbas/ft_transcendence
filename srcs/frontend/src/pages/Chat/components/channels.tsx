import { useState } from "react"
import { FormCreateChannel } from "./formCreateChannel";
import { FormJoinChannel } from "./formJoinChannel";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts";

export const Channels = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	const { setRoom, myRooms } = useChat();
	
	return (
		<>
			<div>
				<h3>
					Channels
					<button onClick={() => setPopupVisibility(true)}>
						+
					</button>
				</h3>
			{popupVisibility && (
				<div className="chat-popup">
					<FormCreateChannel
						setPopupVisibility={setPopupVisibility}
					/>
					<FormJoinChannel
						setPopupVisibility={setPopupVisibility}
					/>
				</div>
			)}
			</div>
			<ClickableList
				items={myRooms}
				renderItem={room => (
					room.type !== RoomType.DIRECTMESSAGE &&
					!room.isBanned && !room.isKicked)
					? (
						<p className="roomList">
							{room.roomName}
							{
								room.unreadMessages > 0
								? room.unreadMessages < 10
								? ` [${room.unreadMessages}]`
								: ` [9+]`
								: ""
							}
						</p>
					)
					: <></>
				}
				onClickItem={room => setRoom(room)}
				/>
		</>
	)
}
