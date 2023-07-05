import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';

const StyledSideNav = styled.div`
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 250px;     /* Set the width of the sidebar */
  z-index: 1;      /* Stay on top of everything */
  top: 5em;      /* Stay at the top */
  background-color: rgb(88, 110, 124);
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
`;


class SideNav extends React.Component {
	render() {
		return (
		 <StyledSideNav></StyledSideNav>
		);
	  }
}


export default class Sidebar extends React.Component {
	render() {
	  return (
		<SideNav></SideNav>
	  );
	}
  }
