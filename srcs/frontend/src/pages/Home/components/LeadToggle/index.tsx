import './styles.css'
import React, { useState, useContext } from 'react';
import { UserContext } from '../../../../contexts'
import MatchHistory from '../MatchHistory';

function LeaderBoard() {

	const { user, setUser } = useContext(UserContext)
	const [isLeaderBoardVisible, setIsLeaderBoardVisible] = useState(true);
	const [isMatchHistoryVisible, setIsMatchHistoryVisible] = useState(false);
	const [toggleButton, setToggleButton] = useState(true);

	const handleDisplayLeaderBoard = () => {
		setIsLeaderBoardVisible(true);
		setIsMatchHistoryVisible(false);
		setToggleButton(true);
	};
  
	const handleDisplayMatchHistory = () => {
		setIsMatchHistoryVisible(true);
	  	setIsLeaderBoardVisible(false);
		setToggleButton(false);

	};

	const isWon = true;
	const isLost = true;

  return (
	<div className="LeaderBoard-MatchHistoryToggleSection">
			<div className="leader-button-box">
			 {toggleButton && (
	 			<div id="leader-btn-color"></div>)}
			{!toggleButton && (
	 			<div id="match-btn-color"></div>)}
	 			<button type="button" className="leader-toggle-button" onClick={handleDisplayLeaderBoard}>Leader Board</button>
	 			<button type="button" className="leader-toggle-button" onClick={handleDisplayMatchHistory}>Match History</button>
	 		</div>
	 		{/* <div className="title-box">
	 			<div className="LeaderBoardTitle">LeaderBoard</div>
	 		</div> */}
		{isLeaderBoardVisible && (
			<div className="UserScoreSection">
				{/* <Friends/> */}
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
				<div className="UserScores"></div>
			</div>
		)}
		{isMatchHistoryVisible && (
			<MatchHistory/>
			// <div className="MatchHistorySection">
			// 	<div className={isWon ? 'UserMatchHistory userWonMatch' : 'UserMatchHistory userLostMatch'}>
			// 		<div className="imageUserMatch">
			// 			<img src={user.avatar} id="Avatar" alt=""/>
			// 		</div>
			// 		<div>5</div>
			// 		<div>VS</div>
			// 		<div>3</div>
			// 		<div className="imageUserMatch">
            //   			<img src={user.avatar} id="Avatar" alt=""/>
            // 		</div>
			// 	</div>
			// 	<div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
			// 		<div className="imageUserMatch">
			// 			<img src={user.avatar} id="Avatar" alt=""/>
			// 		</div>
			// 		<div>5</div>
			// 		<div>VS</div>
			// 		<div>3</div>
			// 		<div className="imageUserMatch">
            //   			<img src={user.avatar} id="Avatar" alt=""/>
            // 		</div>
			// 	</div>
			// 	<div className="UserScores"></div>
			// </div>
		)}
	</div>
	);
  };
  
  export default LeaderBoard;