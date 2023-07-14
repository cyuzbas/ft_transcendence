import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider, GameProvider, UserContext } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat, Login } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Friends } from './components';
import Navbar from './components/Nav/navBar';
import SideBar from './components/Nav/sideBar';
import React, { useContext } from 'react';
import './components/Nav/main.css';


export function Router() {
  const {user} = useContext(UserContext)
  return (
    <React.Fragment>
            <BrowserRouter>
              <UserProvider>

      <section>
        <div className='NavContent'>
          <Navbar />
        </div>
      </section>
      <section>
        <div className='FullPage'>
          <div className='SideContent'>
            <SideBar />
          </div>
          <div className='MainContent'>
                <SocketProvider>
                  <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/friends' element={<Friends />} />
                    <Route path='/friend' element={<Friends />} />
                    <Route path='/lobby' element={<Lobby />} />
                    <Route path='/chat' element={  <Chat/>} />
                    {/* <Route path='/chat' element={<Chat />} /> */}
                    {gameModes.map((mode: GameMode) => (
                      <Route
                        key={mode}
                        path={`/${mode}`}
                        element={
                          <GameProvider>
                            <Game gameMode={mode} />
                          </GameProvider>
                        }
                      />
                    ))}
                  </Routes>
                </SocketProvider>
          </div>
        </div>
      </section>
      </UserProvider>
            </BrowserRouter>
    </React.Fragment>
  )

}