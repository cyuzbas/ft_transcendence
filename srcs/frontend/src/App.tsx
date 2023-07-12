import { SettingsProvider } from './contexts'
import { Router } from './router'
import './main.css'

export function App() {
  return (
    // <UserProvider>
    <SettingsProvider>
      <Router />
    </SettingsProvider>
    // </UserProvider>
  )
}
