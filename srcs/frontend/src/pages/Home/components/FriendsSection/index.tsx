import './styles.css'
import { UserContext } from '../../../../contexts'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  id: string;
};


type User = {
  avatar: string;
  userName: string;
  intraId: string;
  isLogged: boolean;
};



const FriendsSection: React.FC<Props> = ({ id }) => {

	const [users, setUsers] = useState<User[]>([]); // User[] olarak değiştirin

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get(`http://localhost:3001/friends/allUser/${id}`);
			const { friends} = response.data;
	
			// Backend'den dönen verilere göre "userStatus" alanını belirleyerek "User" tipinde nesneler oluşturun
			const usersData = [...friends.map((friend: User) => ({ ...friend }))]
			setUsers(usersData);
			console.log(JSON.stringify(users))
		  } catch (error) {
			console.error(error);
			console.log("ERROR!!")
		  }
		};
	
		fetchData();
	  }, []);
	
  return (<>
	{Array.isArray(users) ? (
        users.map((user, index) => (
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

				
	</div>))):(<p>no users found</p>)}
	
	</>
	);
  };
  
  export default FriendsSection;