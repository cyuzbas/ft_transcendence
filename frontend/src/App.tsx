import { useState } from 'react';
import './App.css';
import HomePage from './compunent/HomePage';
import Home from './compunent/Home';
import Login  from './compunent/Login';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, NavLink } from 'react-router-dom'
//import Nav from './compunent/Nav/nav';
import {NavigationBar} from './compunent/Nav/header';
import SideBar from './compunent/Nav/sidebar';

import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';


function App() {
  const [data, setData] = useState(''); 
  return (
    <>
    {/* <Nav/> */}
    <NavigationBar/>
    <SideBar/>
    <Routes>
      <Route path='/' element={<HomePage/>} />
      {/* <Route path='/home' element={<Home/>} /> */}
      <Route path='/login' element={<Login/>} />
   </Routes>
   </>
  ); 
  
}

export default App;
