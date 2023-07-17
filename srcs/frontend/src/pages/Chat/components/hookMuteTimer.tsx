import { useEffect, useState } from "react";
import { RoomUser } from "../../../contexts";

export function useMuteTimer(room: RoomUser) {
  const [muteRemaining, setMuteRemaining] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (room.isMuted && room.muteEndTime) {
      const currentTime = new Date();
      const muteEndTime = new Date(room.muteEndTime);
      const diff = Math.floor((+muteEndTime - +currentTime) / 1000);
      setMuteRemaining(diff);

      if (diff > 0) {
        intervalId = setInterval(() => {
          setMuteRemaining((muteRemaining) => muteRemaining - 1);
        }, 1000);
      }
    } else {
      setMuteRemaining(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [room]);

  return muteRemaining;
}
