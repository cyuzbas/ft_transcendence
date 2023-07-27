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

class GameDto {
    id?: number;
    playerScore?: number;
    opponentScore?: number;
    type?: string;
    playerId?: number;
    opponentId?: number;
}

const MatchHistory: React.FC<Props> = ({ id }) => {

	const [users, setUsers] = useState<User[]>([]);
	const [matches, setMatches] = useState<GameDto[]>([]);


	
	useEffect(() => {
		const fetchData = async () => {
			try {
				// const response = await axios.get(`http://localhost:3001/friends/allUser/${id}`,{withCredentials:true});
				// const { friends, nonFriends, me, query } = response.data;
			
				// const usersData = [...friends.map((friend: User) => ({ ...friend })),
				// ...nonFriends.map((nonFriend: User) => ({ ...nonFriend})),
				// ...query.map((query:User) =>({...query })),
				// ...me.map((meUser: User) => ({ ...meUser }))];
				// setUsers(response.data);
			// 
			//{"id":2,"playerScore":3,"opponentScore":2,"type":"CLASSIC","playerId":1,"opponentId":2},
			// const response = await axios.get(`http://localhost:3001/game/${id}`,{withCredentials:true});
			// console.log("BURASI MATCH  " + JSON.stringify(response.data))
			// setMatches(response.data)
			// console.log(response.data[0].playerId)
			// console.log(JSON.stringify(matches))
			//  console.log(matches)
			// const convertedMatches: Match[] = response.data.map((item: any) => ({
			// 	playerScore: item.playerScore,
			// 	opponentScore: item.opponentScore,
			// 	playerId: item.playerId,
			// 	opponentId: item.opponentId,
			//   }));
			// console.log(JSON.stringify(convertedMatches))

			//   setMatch(convertedMatches);
			// console.log(JSON.stringify(matches))

			// response.data.forEach((match: any) => {
			// 	  let newMatch[]: Match = {
			// 		playerId: match.playerId,
			// 		opponentId: match.opponentId,
			// 		playerScore: match.playerScore,
			// 		opponentScore: match.opponentScore,
			// 	  }
			// 	  setMatch(newMatch)
			// 	}
			// )
			

				
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
	  }, []);
	
	const isWon = true;
	const isLost = true;

  return (
	<>
		<div className="MatchHistorySection">
	{( users.length ) ? (
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
			{/* <div className="DummyContent"></div>
			<div className="DummyContent"></div> */}
		</div>
		))):
		(
			<p  className="NoUsersFound">You haven't played a match before!</p>
		)
		
	}
	</div>
	</>
	);
	}
  export default MatchHistory;