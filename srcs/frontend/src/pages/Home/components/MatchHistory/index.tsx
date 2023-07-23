import './styles.css'
import React, { useContext } from 'react';
import { UserContext } from '../../../../contexts'

function MatchHistory() {

	const { user } = useContext(UserContext);

	//FROM DATABASE OPONENT GAMES, REAL DATA WILL COME
	const isWon = true;
	const isLost = true;

  return (
	// There will be array of oponents match
		<div className="MatchHistorySection">
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
			</div>
			<div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
					<div className="MatchHistoryScore" id="ScoreFirstUser">18</div>
					<div className="VS">-</div>
					<div className="MatchHistoryScore" id="ScoreSecondUser">22</div>
					<div className="imageUserMatch" id="imageSecondUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
				</div>
			<div className="DummyContent"></div>
			<div className="DummyContent"></div>
		</div>
	);
	}
  export default MatchHistory;