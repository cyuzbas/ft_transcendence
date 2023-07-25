import 'bootstrap-icons/font/bootstrap-icons.css';
import './sideBar.css';
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../../../contexts'

function SideBar() {
	
	const {user} = useContext(UserContext)

	async function logout() {
			console.log("cikis")
			try{
			const response = await axios.get('http://localhost:3001/auth/logout',{withCredentials:true})
			
			localStorage.clear();
			window.location.href="/login"
		}
		catch(error){
			console.error(error)
			localStorage.clear();
			window.location.href="/login"
		}
	}
	return (
	<div className="sideBarContainer">
	  <div className="d-flex flex-column">
		<ul className="nav flex-column">
		  <li className="nav-item">
			<a href="/home" className="d-flex mb-5">
		  <i className="bi bi-house-door fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/lobby" className="nav-link mb-5">
			  <i className="bi bi-controller fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/chat" className="nav-link mb-5">
			  <i className="bi bi-wechat fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href={`/profile/${user.intraId}`} className="nav-link mb-5">
			  <i className="bi bi-person fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/settings" className="nav-link mb-5">
			  <i className="bi bi-gear sidebar-settings fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<button onClick={logout} className="nav-link logout">
			  <i className="bi bi-door-open fs-2"></i>
			</button>
		  </li>
		</ul>
	   </div>
	</div>
	  );  
}

export default SideBar
