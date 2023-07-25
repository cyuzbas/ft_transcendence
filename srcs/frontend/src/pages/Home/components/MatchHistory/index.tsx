import './styles.css'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts'
import axios from 'axios';

type Props = {
	id: string;
};

type User = {
	avatar: string;
	userName: string;
	intraId: string;
	intraName: string;
	isLogged: boolean;
};

const MatchHistory: React.FC<Props> = ({ id }) => {

	const [users, setUsers] = useState<User[]>([]);
	// const { user } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get(`http://localhost:3001/friends/allUser/${id}`);
			const { friends, nonFriends, me, query } = response.data;
	
			const usersData = [...friends.map((friend: User) => ({ ...friend })),
			...nonFriends.map((nonFriend: User) => ({ ...nonFriend })),
			...query.map((query:User) =>({...query })),
			...me.map((meUser: User) => ({ ...meUser }))];

			setUsers(usersData);
			console.log("MATCH History" + JSON.stringify(users))
		  } catch (error) {
			console.error(error);
			console.log("ERROR!!")
		  }
		};
		fetchData();
	  }, []);
	
	//FROM DATABASE OPONENT GAMES, REAL DATA WILL COME
	const isWon = true;
	const isLost = true;

  return (
	<>
		<div className="MatchHistorySection">
	{Array.isArray(users) ? (
		users.map((user, index) => (
	// There will be array of oponents match
			<div className={isWon ? 'UserMatchHistory userWonMatch' : 'UserMatchHistory userLostMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
				<div className="MatchHistoryScore" id="ScoreFirstUser">5</div>
				<div className="VS">-</div>
				<div className="MatchHistoryScore" id="ScoreSecondUser">3</div>
				<div className="imageUserMatch" id="imageSecondUser">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
			{/* <div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
					<div className="MatchHistoryScore" id="ScoreFirstUser">18</div>
					<div className="VS">-</div>
					<div className="MatchHistoryScore" id="ScoreSecondUser">22</div>
					<div className="imageUserMatch" id="imageSecondUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
				</div> */}
			
		</div>
		))):
		(
			<div>No users found</div>
		)
		
	}
		<div className="DummyContent"></div>
		<div className="DummyContent"></div>
	</div>
	</>
	);
	}
  export default MatchHistory;