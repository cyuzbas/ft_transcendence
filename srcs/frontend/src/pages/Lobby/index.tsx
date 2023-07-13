import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from './components/SettingsModal'
import './styles.css'

export function Lobby() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <div className='lobby'>
      <div className='containerlobby'>
      {/* <h1>...</h1> */}
        <div className='left-column'>
          <div className='avatar'>avatar</div>
          <div className='avatar'>score</div>
          {/* Links to different game modes */}
          <div className='gameMode'>
            <Link to='/solo' className='button-73'>SOLO</Link>
            <Link to='/multiplayer' className='button-73'>MULTIPLAYER</Link>
            <Link to='/random' className='button-73'>RANDOM GAME</Link>
          </div>
        </div>
        <div className='right-column'>
          <div className='friendList'>invite a friend </div>
        </div>
      </div>
      <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
    </div>
  );
}






