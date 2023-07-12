import { useState } from 'react';
import './App.css';
import MainPage from './compunent/MainPage';
import OldLogin  from './compunent/OldLogin';
import Login from './compunent/Login/Login'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, NavLink } from 'react-router-dom'


function App() {
  const [data, setData] = useState(''); 
  return (
    <>
    
    {/* All the other page rendering is going to happen in MainPage so nav-sidebar would be attached */}
    <Routes>
      <Route path='/home' element={<MainPage/>} /> 
      <Route path='/login' element={<Login/>} />
      <Route path='/' element={<Login/>} />
      {/* <Route path='/login' element={<OldLogin/>} /> */}
   </Routes>
   </>
  ); 
  
}

export default App;
