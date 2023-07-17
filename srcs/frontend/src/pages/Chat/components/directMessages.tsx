import { useState } from "react";
import { FormAddContact } from "./formAddContact";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts";

export const DirectMessages = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
    const { setRoom, myRooms } = useChat();

    return (
        <>
			<h3>
                Direct Messages
                <button onClick={() => setPopupVisibility(true)}>
                    + 
                </button>
            </h3>
            <ClickableList
                items={myRooms}
                renderItem={room => room.type === RoomType.DIRECTMESSAGE
                    ? (
                        <p className="roomList">
                            {room.contactName}
                            {room.unreadMessages > 0 && ` [${room.unreadMessages}]`}
                        </p>
                    ): <></>
                }
                onClickItem={room => setRoom(room)}
                />
            {popupVisibility && (
                <div className="chat-popup">
                    <FormAddContact setPopupVisibility={setPopupVisibility} />
                </div>
			)}
        </>
    )
}
