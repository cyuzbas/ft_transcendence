import { useRef, useEffect, useState } from 'react'
import { Ball, Paddle, Score, Timer, Net } from './components'
import { useGame } from '../../contexts'
import { GameMode } from './logic/types'
import styled from 'styled-components'

type GameProps = {
  gameMode?: GameMode
}

const Background = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export function Game({ gameMode = 'endless' }: GameProps) {
  const ballRef = useRef<HTMLDivElement>(null)
  const playerPaddleRef = useRef<HTMLDivElement>(null)
  const computerPaddleRef = useRef<HTMLDivElement>(null)
  const { setUp, start, gameState } = useGame()
  const [rules, setRules] = useState('');
  
  useEffect(() => {
    if (
      ballRef.current &&
      playerPaddleRef.current &&
      computerPaddleRef.current &&
      !gameState.isGameRunning
    ) {
      setUp(
        ballRef.current as HTMLDivElement,
        playerPaddleRef.current as HTMLDivElement,
        computerPaddleRef.current as HTMLDivElement,
        { gameMode }
      )

      start()
    }
  }, [
    ballRef.current,
    playerPaddleRef.current,
    computerPaddleRef.current,
    gameState.isGameRunning,
  ])

  useEffect(() => {
    if (gameMode === 'solo')
      setRules("Play using your mouse");
    else if (gameMode === 'multiplayer')
      setRules("Play using ArrowUp ArrowDown");
  }, [gameMode]);

  return (
    <>
      <Background>
        {/* <Timer/> */}
        <Timer str={rules}/>
        <Score />
        <Net />
        <Ball ballRef={ballRef} />
        <Paddle paddleRef={playerPaddleRef} />
        <Paddle paddleRef={computerPaddleRef} side='right' />
      </Background>
    </>
  )
}
