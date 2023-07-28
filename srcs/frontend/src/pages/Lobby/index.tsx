import { useState } from 'react'
// import { useState, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from './components/SettingsModal'
import * as Components from './containers';
import React from "react";
import SoloImg from './assets/single.png';
import MultiImg from './assets/multi.png';
import './styles.css'

export function Lobby() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [settings, toggle] = useState(true);
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [username, setUsername] = useState<string>('');

  // const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   setIsOpen(true);
  // };

  // const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   setIsOpen(false);
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);

  const mainLobby = {
    height: '100%',
    width: '100%',
  
    backgroundColor: 'var(--background-color)',
  };

  return (
    <>
    <div className='mainLobby' style={mainLobby}>
    <Components.Container>
      {settings ? (
        <Components.OfflineContainer deneme={settings.toString()}>
          <Components.Card>
            <Components.TopCard>
              <Link to='/solo' className='games1'>
                <img src={SoloImg} alt="Solo" className='img1'/>
                SOLO
              </Link>
            </Components.TopCard>
            <Components.BottomCard>
              <Link to='/multiplayer' className='games2'>
                <img src={MultiImg} alt="Multi" className='img2'/>
                MULTIPLAYER
              </Link>
            </Components.BottomCard>
          </Components.Card>
          <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
        </Components.OfflineContainer>
      ) : (
        <Components.OnlineContainer deneme={settings.toString()}>
          {/* <WaitingPage isOpen={isLookingForOpponent} setIsOpen={setIsLookingForOpponent} /> */}
          <Components.Card>

            <Link to='/findingopponentClassic' className='mylink1'>CLASSIC GAME</Link>
            <Link to='/findingopponentCustom' className='mylink2'>CUSTOM GAME</Link>
            
            {/* add hereee */}
            {/* {!isOpen && (
              <button onClick={handleOpen} className='flap'>
                Invite a Friend
              </button>
            )}
            {isOpen && (
              <div className='popup'>
                  <input className='box' type="text" value={username} onChange={handleChange} placeholder="Username"/>
                  <Link to={{ pathname: '/waitingreply', search: `?username=${username}`}} className='add'>
                    <PlusIcon />
                  </Link>
                <button className='close' onClick={handleClose} >
                  <CloseIcon />
                </button> */}
                
              {/* </div>
            )} */}
            
            {/* <Link to='/invitation' className='button'>Random Game</Link> */}
            {/* <Components.Button onClick={handleRandomGame}>Random Game</Components.Button> */}
            {/* <Components.Button onClick={handleInvitation}>Invite a Friend</Components.Button> */}
          </Components.Card>
        </Components.OnlineContainer>
      )}
  
      <Components.OverlayContainer deneme={settings.toString()}>
        <Components.Overlay deneme={settings.toString()}>
          <Components.LeftOverlayPanel deneme={settings.toString()}>
            <Components.GhostButton onClick={() => toggle(true)}>
              play offline
            </Components.GhostButton>
          </Components.LeftOverlayPanel>
  
          <Components.RightOverlayPanel deneme={settings.toString()}>
            <Components.GhostButton onClick={() => toggle(false)}>
              play online
            </Components.GhostButton> 
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
    </div>
    </>
  );
  
    // <div className='lobby'>
    //   <div className='containerlobby'>
    //   {/* <h1>...</h1> */}
    //     <div className='left-column'>
    //       <div className='avatar'>avatar</div>
    //       <div className='avatar'>score</div>
    //       <Link to='/solo' className='button-73'>SOLO</Link>
    //       <Link to='/multiplayer' className='button-73'>MULTIPLAYER</Link>
    //     </div>
    //     <div className='right-column'>
    //       <button className="button-74" onClick={handleRandomGame}>
    //         Random Game
    //       </button>
    //       <button className="button-74" onClick={handleInvitation}>
    //         Invite a Friend
    //       </button>
    //     </div>
    //   </div>
    //   <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
    // </div>
  // );
}







