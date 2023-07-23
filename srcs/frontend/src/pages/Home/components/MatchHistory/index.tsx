import './styles.css'
import React, { useContext } from 'react';
import { UserContext } from '../../../../contexts'

function MatchHistory() {

	const { user, setUser } = useContext(UserContext);

	//FROM DATABASE OPONENT GAMES, REAL DATA WILL COME
	const isWon = true;
	const isLost = true;

  return (
	// There will be array of oponents match
		<div className="MatchHistorySection">
			<div className={isWon ? 'UserMatchHistory userWonMatch' : 'UserMatchHistory userLostMatch'}>
				<div className="imageUserMatch">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
				<div className="MatchHistoryScore">5</div>
				<div>VS</div>
				<div className="MatchHistoryScore">3</div>
				<div className="imageUserMatch">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
			</div>
			<div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
				<div className="imageUserMatch">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
				<div className="MatchHistoryScore">5</div>
				<div>VS</div>
				<div className="MatchHistoryScore">3</div>
				<div className="imageUserMatch">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
			</div>
			<div className="UserScores"></div>
		</div>
	);
	}
  export default MatchHistory;