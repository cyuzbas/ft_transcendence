import { useGame } from '../../../../contexts'
import './styles.css'

export function Score() {
  const { gameState } = useGame()

  return (
    <div className='score'>
      <div id='player-score'>{gameState.score[0]}-</div>
      <div id='computer-score'>{gameState.score[1]}</div>
    </div>
  )
}
