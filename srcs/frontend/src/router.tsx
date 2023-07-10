import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './contexts';
import { GameProvider } from './contexts'
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat, Login } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Nav, Friends } from './components'


export function Router() {
  const [user, setUser] = useState<string>('unKnown')

  return (
    <BrowserRouter>

    {/* <div id="main-grid"> */}
      {/* <Login user={user} setUser={setUser} /> */}
        <UserProvider>
          <SocketProvider>
      <Nav />

      <Routes>

        <Route index element={<Home />} />
        <Route path='/friends' element={<Friends/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/friend' element={<Friends />} />
        <Route path='/lobby' element={<Lobby />} />
        <Route path='/chat' element={<Chat />} />

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
          </UserProvider>
          {/* </div> */}
    </BrowserRouter>
  )
}
