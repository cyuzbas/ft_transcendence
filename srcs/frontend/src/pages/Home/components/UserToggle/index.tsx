import './styles.css'
import { Friends } from '../../../../components';
import React, { useState } from 'react';
import FriendsSection from '../FriendsSection';

function FriendsToggle() {

	const [isAllUsersVisible, setIsAllUsersVisible] = useState(true);
	const [isFriendsVisible, setIsFriendsVisible] = useState(false);
	const [toggleButton, setToggleButton] = useState(true);

	const handleDisplayAllUsers = () => {
		setIsAllUsersVisible(true);
		setIsFriendsVisible(false);
		setToggleButton(true);
	};
  
	const handleDisplayFriends = () => {
		setIsFriendsVisible(true);
	  	setIsAllUsersVisible(false);
		setToggleButton(false);

	};


  return (
	<div className="Friend-UsersSection">
	 		<div className="button-box">
			 {toggleButton && (
	 			<div id="btn-color"></div>)}
			{!toggleButton && (
	 			<div id="friends-btn-color"></div>)}
	 			<button type="button" className="toggle-button" onClick={handleDisplayAllUsers}>All Users</button>
	 			<button type="button" className="toggle-button" onClick={handleDisplayFriends}>Friends</button>
	 		</div>
		{isAllUsersVisible && (
			<div id="AllUsers" className="UsersSection">
				<Friends/>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
			</div>
		)}
		{isFriendsVisible && ( <FriendsSection/> )}
	</div>
	);
  };
  
  export default FriendsToggle;