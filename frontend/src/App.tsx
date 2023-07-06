import React, { useContext,useState , useEffect } from 'react';

import './App.css';
import HomePage from './compunent/HomePage';
import Login  from './compunent/Login';
import {Routes, Route } from 'react-router-dom'
import Nav from './compunent/Nav/nav';
import Friend from './compunent/friend';
import { UserContext } from './compunent/Context/context';

import UserProvider from './compunent/Context/context';
import axios from 'axios'


function App() {

 
 

  const {user, setUser} = useContext(UserContext)
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //     const response = await axios.get('http://localhost:3001/auth/status', {withCredentials: true})
  //     if(!response.data)
  //     {
  //       console.log("no user")
  //     }
  //     else{
  //     setUser(response.data);
  //     console.log(response.data.avatar + " asdasd")
  //   }
  //     } catch (error) {
  //       console.error("Error logout!")
  //       window.location.href = '/login'
  //     }
  //   };

  //   fetchData();
  // }, []);
  return (
    <UserProvider>
<Nav/>
  <Routes>
  
    <Route path='/' element={<HomePage />} />
    <Route path='/login' element={<Login />} />
    <Route path='/friend' element={<Friend />} />
    <Route path='/chatRooms' element={<Friend />} />
    <Route path='/game' element={<Friend />} />
    
  </Routes> 
  </UserProvider>
  ); 
  
}

export default App;