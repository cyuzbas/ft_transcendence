// import { SettingsIcon } from '../../assets'
// import { Button } from './Button'
import { Modal } from './Modal'
import { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from "../../../../contexts"
import queryString from 'query-string';


export function WaitingPage1() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    function onMatched() {
        console.log('matched');
        setIsLookingForOpponent(false);
        navigate('/random');
    }
    socket.on("matchFound", onMatched);
    return () => {
      socket.off('matchFound', onMatched);
      // socket.disconnect();
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelMatching() {
        console.log('cancel');
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("gameUnqueued", onCancelMatching);
    return () => {
      socket.off('gameUnqueued', onCancelMatching);
      // socket.disconnect();
    };
  }, [socket, navigate]);

  socket.emit("matchMaking");

  return (
    <>
      {isLookingForOpponent && (
        <div>Looking for an opponent</div>
      )}
    </>
  )
}

export function WaitingPage2() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = queryString.parse(location.search);
  const username = queryParams.username;

  useEffect(() => {
    function onSend() {
        console.log('++++++++invite send, waiting for respond');
        setIsLookingForOpponent(true);
        // navigate('/random');
    }
    socket.on("invitesent", onSend);
    return () => {
      socket.off('invitesent', onSend);
      // socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    function onAccepted() {
        setIsLookingForOpponent(false);
        navigate('/friendgame');
    }
    socket.on("gameAccepted", onAccepted);
    return () => {
      socket.off('gameAccepted', onAccepted);
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelInvite() {
        console.log('cancel');
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("error", onCancelInvite);
    return () => {
      socket.off('gameUnqueued', onCancelInvite);
      // socket.disconnect();
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("Invite", { userName: username });
    return () => {
      // socket.off('gameUnqueued', onCancelInvite);
      // socket.disconnect();
    };
  }, []);

  return (
    <>
      {isLookingForOpponent && (
        <div>Waiting reply from your friend</div>
      )}
    </>
  )
}

