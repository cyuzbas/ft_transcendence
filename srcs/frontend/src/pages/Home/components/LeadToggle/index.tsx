import './styles.css'
import React, { useState } from 'react';
import MatchHistory from '../MatchHistory';
import LeaderBoard from '../LeaderBoard';

function LeaderMatchToggle() {

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

  return (
	<div className="LeaderBoard-MatchHistoryToggleSection">
			<div className="leader-button-box">
				{toggleButton && (<div id="leader-btn-color"></div>)}
				{!toggleButton && (<div id="match-btn-color"></div>)}
				<button type="button" 
					className="leader-toggle-button" 
					onClick={handleDisplayLeaderBoard}>Leader Board
				</button>
				<button type="button" 
					className="leader-toggle-button" 
					onClick={handleDisplayMatchHistory}>Match History
				</button>
	 		</div>
		{isLeaderBoardVisible && ( <LeaderBoard/> )}
		{isMatchHistoryVisible && ( <MatchHistory/> )}
	</div>
	);
  };
  
  export default LeaderMatchToggle;