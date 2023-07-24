import './styles.css'
import React, { useContext } from 'react';
import { UserContext } from '../../../../contexts'
import social from '../../../../img/achievements/social.png'
import fresPaddle from '../../../../img/achievements/freshPaddle.png'
import chameleon from '../../../../img/achievements/chameleon.png'
import chatterBox from '../../../../img/achievements/chatterBox.png'
import rivalry from '../../../../img/achievements/rivalry.png'
import whisperer from '../../../../img/achievements/pongWhisperer.png'
import victory from '../../../../img/achievements/firstVictory.png'
import fail from '../../../../img/achievements/epicFail.png'

function Achievements() {

	const { user } = useContext(UserContext)

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
					<h4 className="badgeText">FRESH PADDLE</h4>
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