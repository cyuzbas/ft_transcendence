import React, { useContext, useState, useRef }  from 'react';
import { Nav, Navbar, Form, FormControl,  } from 'react-bootstrap';
import styled from 'styled-components';
import Intra from '../../../img/ft.png';
import { UserContext } from '../../../contexts'
import { Request } from '../FriendRequest/FriendRequest';
import './styles.css'


const Styles = styled.div`
  a, .navbar-nav, .navbar-light .nav-link {
  z-index: 2;
  color: rgb(178,225,255);
  // &:hover { color: white; }
  }
  
  .navbar-brand {
    font-size: 1.4em;
    color: rgb(178,225,255);
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 20%;
    right: 20%;
  }

  `;


function NavigationBar () {

  const { user, setUser } = useContext(UserContext);
  const[open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleDropDownFocus = (state: boolean) => {
    setOpen(!state);
  };
  const handleClickOutsideDropdown =(e:any)=>{
    if(open && !dropdownRef.current?.contains(e.target as Node)){
      setOpen(false)
      
    }
  }
  window.addEventListener("click",handleClickOutsideDropdown)

  

return (
  <Styles>
    <Navbar>
	    <Navbar.Brand href="/home">
        <img src={Intra} alt="Ft-icon" className='icon'/>
        <text className='brand'>PONG</text>
      </Navbar.Brand>
      {/* <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form> */}
      <Nav className="ms-auto">
		  <Nav.Item>
        <div className="friend-drop-down-container" ref={dropdownRef}>
		  	  <i className="bi bi-people-fill fs-3 me-2 friendsRequestButton" onClick={(e) => handleDropDownFocus(open)}>
            <span className="position-absolute top-0 start-90 translate-middle p-1 bg-ligh border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </i>
          {open && (
            <ul>
              <li>
                <Request/>
              </li>
            </ul>
          )}
        </div>
          </Nav.Item> 
          <Nav.Item><Nav.Link href="/home">
            <text className='userName'>{user.userName}</text>
            <img src={user.avatar} className='avatar'/>
          </Nav.Link></Nav.Item>  
        </Nav>
    </Navbar>
  </Styles>
);
  }

export default NavigationBar;