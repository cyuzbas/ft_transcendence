import './styles.css'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts'
import social from '../../../../img/achievements/social.png'
import fresPaddle from '../../../../img/achievements/freshPaddle.png'
import chameleon from '../../../../img/achievements/chameleon.png'
import chatterBox from '../../../../img/achievements/chatterBox.png'
import rivalry from '../../../../img/achievements/rivalry.png'
import whisperer from '../../../../img/achievements/pongWhisperer.png'
import victory from '../../../../img/achievements/firstVictory.png'
import fail from '../../../../img/achievements/epicFail.png'
import axios from 'axios';

function Achievements() {
	
	const { user , setUser} = useContext(UserContext)

	enum AchievementType {
		FRESH_PADDLE = 'FRESH_PADDLE',
		FIRST_VICTORY = 'FIRST_VICTORY',
		PONG_WHISPERER = 'PONG_WHISPERER',
		CHATTERBOX = 'CHATTERBOX',
		SOCIAL_BUTTERFLY = 'SOCIAL_BUTTERFLY',
		CHAMELEON_PLAYER = 'CHAMELEON_PLAYER',
		FRIENDLY_RIVALRY = 'FRIENDLY_RIVALRY',
		EPIC_FAIL = 'EPIC_FAIL',
	  }
	
	  
	  interface AchievementData {
		[AchievementType.FRESH_PADDLE]: boolean;
		[AchievementType.FIRST_VICTORY]: boolean;
		[AchievementType.PONG_WHISPERER]: boolean;
		[AchievementType.CHATTERBOX]: boolean;
		[AchievementType.SOCIAL_BUTTERFLY]: boolean;
		[AchievementType.CHAMELEON_PLAYER]: boolean;
		[AchievementType.FRIENDLY_RIVALRY]: boolean;
		[AchievementType.EPIC_FAIL]: boolean;
		id: number;
	  }

	  const [userData, setUserData] = useState<AchievementData| null>(null);


	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response =  await axios.get(`http://localhost:3001/user/achievements/${user.intraId}`,{withCredentials:true})
			setUserData(response.data[0]);
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
	  }, []);

	

  return (
	<div className="AchievementsSection">
	 		<div className="title-box">
	 			<div className="AchievementsTitle">ACHIEVEMENTS</div>
	 		</div>
			<div className="BadgesSection">
				<div className="badges">
					<div className="badgeClass">
						<img src={fresPaddle} className="badgeimage" id={user.userName?"earned":"unearned"} alt='Fresh Paddle'/>
					</div>
					{userData && (<> {userData[AchievementType.FRESH_PADDLE] && (
					<h4 className="badgeText">FRESH PADDLE </h4>
					)}</>)}
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={victory} className="badgeimage" id={user.totalWin?"earned":"unearned"} alt='First Victory'/>
					</div>
					<h4 className="badgeText">FIRST VICTORY</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={whisperer} className="badgeimage" id={user.totalWin>4?"earned":"unearned"} alt='Pong Whisperer'/>
					</div>
					<h4 className="badgeText">PONG WHISPERER</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chatterBox} className="badgeimage" /*id={room.roomName?"earned":"unearned"}*/ alt='Chatterbox'/>
					</div>
					<h4 className="badgeText">CHATTERBOX</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={social} className="badgeimage" /*id={user.friends?"earned":"unearned"}*/ alt='Social Butterfly'/>
					</div>
					<h4 className="badgeText">SOCIAL BUTTERFLY</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chameleon} className="badgeimage" /*id={user.chameleon?"earned":"unearned"}*/ alt='Chameleon Player'/>
					</div>
					<h4 className="badgeText">CHAMELEON PLAYER</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={rivalry} className="badgeimage" /*id={user.winAgainstFriend?"earned":"unearned"}*/ alt='Friendly Rivalry'/>
					</div>
					<h4 className="badgeText ">FRIENDLY RIVALRY</h4>
				</div>
				
				<div className="badges">
					<div className="badgeClass">
						<img src={fail} className="badgeimage" id={user.totalLoose?"earned":"unearned"} alt='Epic Fail'/>
					</div>
					<h4 className="badgeText">EPIC FAIL</h4>
				</div>
			</div>
	</div>
	);
  };
  
  export default Achievements;