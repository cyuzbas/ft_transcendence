import { useState } from "react";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts/ChatContext/types";

export const FormEditPassword = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const { room, updateRoom } = useChat();

  const handleRemovePassword = async() => {
    await updateRoom({
      roomId: room.roomId,
      roomName: room.roomName,
      type: RoomType.PUBLIC,
    });
  
    setConfirmationText('Password removed succesfully')
    setConfirmation(!confirmation);
  }
  
  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    await updateRoom({
      roomId: room.roomId,
      roomName: room.roomName,
      type: RoomType.PROTECTED,
      password: newPassword, // HASH
    });
    
    setConfirmationText('Password added succesfully')
    setConfirmation(!confirmation);
    setVisibility(false);
    setNewPassword('');
  }

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        {room.type === RoomType.PROTECTED ? (
          <>
            <button type="button" onClick={() => setVisibility(!visibility)}>
              Edit Password
            </button> 
            <button type="button" onClick={handleRemovePassword}>
              Remove Password
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setVisibility(!visibility)}>
            Add Password
          </button>
        )
        }
        {visibility &&
        <div className="chat-popup">
          <div>
            <input
              placeholder="type in new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              />
          </div>
          <button type="submit">submit</button>
        </div>
        }
        {confirmation &&
        <div className="chat-popup">
          {confirmationText}
          <div>
            <button onClick={() => setConfirmation(!confirmation)}>
              Ok
            </button>
          </div>
        </div>
        }
      </form>
    </>
  )
}
