import './styles.css'
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../../contexts'

type User = {
    avatar: string;
    userName: string;
    intraId: string;
	isLogged: boolean;
	score: number;
	rank: number;
  };

function LeaderBoard() {

	const [users, setUsers] = useState<User[]>([]);
	const { user } = useContext(UserContext)

	useEffect(() => {
		const fetchData = async () => {
		  console.log(user.userName);
		  try {
			const response = await axios.get('http://localhost:3001/friends/allUsers', {withCredentials:true});
			setUsers(response.data);
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
	  }, [user.userName]);

  return (
	<div className="UserScoreSection">
		{( users.length ) ? (
			users
			.sort((a, b) => b.score - a.score)
			.map((user, index) => {
				return(
				<div className="UserScoreComponent" key={user.intraId}>
					<div className='UserScoreHash'>
						<i className="bi bi-hash fs-3"></i>
					</div>
					<div className="UserScoreRank">{index + 1}</div>
					<div className="imageClassUS">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
					<div className="UserScoreUsername">{user.userName}</div>
					<div className="UserScoreValue">{user.score}</div>
				</div>
				);
			})
		) : (
				<p>No users found</p>
		)}
	</div>
	);
  };
  
  export default LeaderBoard;