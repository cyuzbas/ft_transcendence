import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider, GameProvider } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Friends } from './components';
import SettingsPage from './pages/SettingsPage'
import Create2fa from './pages/Create2fa'
import Navbar from './components/Nav/NavBar/navBar';
import SideBar from './components/Nav/SideBar/sideBar';
import NotFound from './pages/NotFound/index';
import React from 'react';
import './components/Nav/main.css';
import { Profile } from './pages/Profile/index';


export function Router() {
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
                    <Route path='/friend' element={<Friends />} />
                    <Route path='/lobby' element={<Lobby />} />
                    <Route path='/chat' element={  <Chat/>} />
                    <Route path='/settings' element={  <SettingsPage/>} />
                    <Route path='/create2fa' element={  <Create2fa/>} />
                    <Route path='/profile' element={  <Profile/>} />
                    <Route path='*' element={ <NotFound/> } />
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