import { useState } from "react";
import { useChat } from "../../../contexts/ChatContext/provider";
import { RoomType } from "../../../contexts/ChatContext/types";
import { AiFillLock, AiFillUnlock, AiOutlineLock } from "react-icons/ai"

export const FormEditPassword = () => {
  // const [visibility, setVisibility] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const { room, updateRoom } = useChat();

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1500)
  }

  const handleRemovePassword = async() => {
    await updateRoom({
      roomId: room.roomId,
      roomName: room.roomName,
      type: RoomType.PUBLIC,
    });

    showSuccessMessage('Password removed succesfully');
  
    // setConfirmationText('Password removed succesfully')
    // setConfirmation(!confirmation);
  }
  
  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    await updateRoom({
      roomId: room.roomId,
      roomName: room.roomName,
      type: RoomType.PROTECTED,
      password: newPassword, // HASH
    });
    
    setAdd(false);
    setEdit(false);
    setNewPassword('');
    showSuccessMessage(`Password ${add ? 'added' : 'updated'} succesfully`);

    // setConfirmationText('Password added succesfully')
    // setConfirmation(!confirmation);
    // setVisibility(false);
  }

  return (
    <>
      <form className="" onSubmit={(e) => onSubmit(e)}>
        {room.type === RoomType.PROTECTED ? (
          <>
            <div className="editPassword">
              <button className="iconBtn" type="button" onClick={() => setEdit(!edit)}>
                <AiOutlineLock size="2em" color={edit ? "grey" : ''}/>
                edit
              </button>
              {edit && !success &&
                <>
                  <input
                  required
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button className="formPasswordBtn" type="submit">
                    SUBMIT
                  </button>
                </>
              }
              {success &&
                <div className="successMessage active"> {successMessage} </div>
              }
            </div>
            <button className="iconBtn" type="button" onClick={handleRemovePassword}>
                <AiFillUnlock size="2em"/>
                remove
            </button>
          </>
        ) : (
          <div className="editPassword">
            <button className="iconBtn" type="button" onClick={() => {setAdd(!add)}}>
              <AiFillLock size="2em" color={add ? "grey" : ''}/>
              add
            </button>
            {add && !success &&
              <>
                <input
                required
                placeholder="Enter Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="formPasswordBtn" type="submit">
                  SUBMIT
                </button>
              </>
            }
            {success && !add &&
            <div className="successMessage active"> {successMessage} </div>
            }
          </div>  
        )
      }
      {/* {success &&
        <div> {successMessage} </div>
      } */}
      </form>
    </>
  )
}




{/* {visibility &&
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
} */}