import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../contexts';
import { Timer } from '../Timer/index';
import { useNavigate } from 'react-router-dom'
import './styles.css'

interface GameState {
  ball: { x: number; y: number; sizeX: number; sizeY: number; };
  paddleLeft: { x: number; y: number; width: number; height: number; };
  paddleRight: { x: number; y: number; width: number; height: number; };
  pause: boolean;
  p1Score: number;
  p2Score: number;
  p1: string;
  p2: string;
  isCustom: boolean;
}

export function Random() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timer, setTimer] = useState(false);
  const [end, setEnd] = useState(false);
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const gameDataHandler = (data: GameState) => {
      // console.log('++++++++++++++++Received game data:', data);
      setGameState(data);
      // console.log(data.isCustom);
    };
    socket.on('gameData', gameDataHandler);
    return () => {
      socket.off('gameData', gameDataHandler);
    };
  }, [socket]);

  useEffect(() => {
    function gameFoundHandler() {
      console.log('gameFound');
      setTimer(true);
    };
    socket.on('gameFound', gameFoundHandler);
    return () => {
      socket.off('gameFound', gameFoundHandler);
    };
  }, [socket]);

  useEffect(() => {
    const gameEndHandler = (data: string) => {
      setMessage(data);
      console.log(data);
      setTimer(false);
      setGameState(null);
      setEnd(true);
      navigate('/lobby');
    };
    socket.on('gameEnd', gameEndHandler);
    return () => {
      socket.off('gameEnd', gameEndHandler);
    };
  }, [socket, message]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Esc'].includes(event.key)) {
        socket.emit('keyDown', event.key);
      }
    };
  
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Esc'].includes(event.key)) {
        socket.emit('keyUp', event.key);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket]);
  

  return (
    <>
      <div>
        {timer && (
          <>
            <Timer />
          </>
        )}
        <div className='game-container'>
          {gameState && (
            <>
              <div className='score'>{`${gameState.p1Score} - ${gameState.p2Score}`}</div>
              <div style={{ position: 'absolute', top: `calc(${gameState.ball.y} * 1vh)`, left: `calc(${gameState.ball.x} * 1vw`, height: `2.5vh`, width: `2.5vh`, backgroundColor: 'var(--foreground-color)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
              <div style={{ position: 'absolute', top: `calc(${gameState.paddleLeft.y} * 1vw)`, left: `1vh`, height: `10vh`, width: `1vh`, backgroundColor: 'var(--foreground-color)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: `calc(${gameState.paddleRight.y} * 1vw)`, right: `1vh`, height: `10vh`, width: `1vh`, backgroundColor: 'var(--foreground-color)', transform: 'translateY(-50%)' }} />
              
              {gameState.isCustom && (
                <div style={{ position: 'absolute', top: `50px`, right: `50px`, height: `50px`, width: `1vh`, color: `red` }} />
              )}
            </>
          )}
        </div>


        {/* {end && (
          <>
            {message}
          </>
        )} */}
      </div>
    </>
  );
};


export function FriendGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timer, setTimer] = useState(false);
  const [end, setEnd] = useState(false);
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const gameDataHandler = (data: GameState) => {
      // console.log('++++++++++++++++Received game data:', data);
      setGameState(data);
    };
    socket.on('gameData', gameDataHandler);
    return () => {
      socket.off('gameData', gameDataHandler);
    };
  }, [socket]);

  useEffect(() => {
    function gameFoundHandler() {
      console.log('gameFound');
      setTimer(true);
    };
    socket.on('gameFound', gameFoundHandler);
    return () => {
      socket.off('gameFound', gameFoundHandler);
    };
  }, [socket]);

  useEffect(() => {
    const gameEndHandler = (data: string) => {
      setMessage(data);
      console.log(data);
      setTimer(false);
      setGameState(null);
      setEnd(true);
      navigate('/lobby');
    };
    socket.on('gameEnd', gameEndHandler);
    return () => {
      socket.off('gameEnd', gameEndHandler);
    };
  }, [socket, message]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Esc'].includes(event.key)) {
        socket.emit('keyDown', event.key);
      }
    };
  
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Esc'].includes(event.key)) {
        socket.emit('keyUp', event.key);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket]);
  

  return (
    <>
      <div>
        {/* friend game */}
        {timer && (
          <>
            <Timer />
          </>
        )}
        <div className='game-container'> 
          {gameState && (
            <>
              <div className='score'>{`${gameState.p1Score} - ${gameState.p2Score}`}</div>
              <div style={{ position: 'absolute', top: `calc(${gameState.ball.y} * 1vh)`, left: `calc(${gameState.ball.x} * 1vw`, height: `2.5vh`, width: `2.5vh`, backgroundColor: 'var(--foreground-color)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
              <div style={{ position: 'absolute', top: `calc(${gameState.paddleLeft.y} * 1vw)`, left: `1vh`, height: `10vh`, width: `1vh`, backgroundColor: 'var(--foreground-color)', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: `calc(${gameState.paddleRight.y} * 1vw)`, right: `1vh`, height: `10vh`, width: `1vh`, backgroundColor: 'var(--foreground-color)', transform: 'translateY(-50%)' }} />
            </>
          )}
        </div>
      </div>
    </>
  );
};