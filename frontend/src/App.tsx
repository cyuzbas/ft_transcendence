import { useState , useEffect} from 'react';
import './App.css';
import HomePage from './compunent/HomePage';
import Login  from './compunent/Login';
import {Routes, Route } from 'react-router-dom'
import Nav from './compunent/Nav/nav';
import Friend from './compunent/friend';

import UserProvider from './compunent/Context/context';


function App() {

  return (
    <UserProvider>
<Nav/>
<Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/login' element={<Login />} />
    <Route path='/friend' element={<Friend />} />
  </Routes> 
  </UserProvider>
  ); 
  
}

export default App;