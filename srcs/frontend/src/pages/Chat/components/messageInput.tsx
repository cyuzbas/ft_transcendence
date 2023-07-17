import { useEffect, useState } from "react";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat, useUser } from "../../../contexts";
import { useMuteTimer } from "./hookMuteTimer";

export const MessageInput = () => {
  const [message, setMessage] = useState<string>('');
  // const [muteRemaining, setMuteRemaning] = useState<number>(0);
  const { user } = useUser()
  const { socket } = useSocket();
  const { room } = useChat();
  const muteRemaining = useMuteTimer(room);

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout;
  
  //   if (room.isMuted && room.muteEndTime) {
  //     const currentTime = new Date();
  //     const muteEndTime = new Date(room.muteEndTime);
  //     const diff = Math.floor((+muteEndTime - +currentTime) / 1000);
  //     setMuteRemaning(diff);

  //     if (diff > 0) {
  //       intervalId = setInterval(() => {
  //         setMuteRemaning(muteRemaining => muteRemaining - 1);
  //       }, 1000)
  //     }
  //   } else {
  //     setMuteRemaning(0);
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   }
  // }, [room])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('newMessage', {
        userName: user.userName,
        content: message,
        roomName: room.roomName,
    });
    
    setMessage('');
  }

  return (
    <div id="chat-footer">
    <form
        className="form" 
        onSubmit={handleSendMessage}>
        {muteRemaining > 0 
        ? <div>You are muted. Time remaining: {muteRemaining} seconds</div>
        : (
          <>
          <input 
            type="text"
            placeholder="Write message"
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}>
          </input>
          <button className="sendBtn">SEND</button>
          </>
        )
        }
      </form>
    </div>
  )
}
