import './styles.css'
import { UserContext } from '../../../../contexts'
import React, { useContext } from 'react';

function FriendsSection() {

	const { user } = useContext(UserContext);

  return (
	<div id="AllFriends" className="UsersSection">
		<div className="FriendsSectionComponent" key={user.intraId}>
			<div className="imageClassFS">
				<img src={user.avatar} id="Avatar" alt=""/>
			</div>
			<div className="FriendsSectionUsername">{user.userName}</div>
			<div className="FriendsSectionIntraname">{/* {user.userScore} */}adoner</div>
			<div className='personOnlineContainer'>
              <i className="bi bi-circle-fill fs-5 FriendsOnlineDisplay"
                id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            </div>
		</div>
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
		<div className="fake-all-users"></div>
				
	</div>
	);
  };
  
  export default FriendsSection;