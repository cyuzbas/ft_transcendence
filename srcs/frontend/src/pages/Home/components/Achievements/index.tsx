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

	// const { user, setUser } = useContext(UserContext)

	// There needs to be isSepecicificBadgeEarned in user, so I can check.

  return (
	<div className="AchievementsSection">
	 		<div className="title-box">
	 			<div className="AchievementsTitle">ACHIEVEMENTS</div>
	 		</div>
			<div className="BadgesSection">
				<div className="badges">
					<div className="badgeClass">
					{/* {user.isSocialBadgeEarned && ( */}
						<img src={fresPaddle} className='badgeimage'/>
					{/* )} */}
					{/* {!user.isSocialBadgeEarned && ( */}
						{/* <img src={social} className='socialBadge unearned'/> */}
					{/* )} */}
					</div>
					<h4 className="badgeText">FRESH PADDLE</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={whisperer} className='badgeimage unearned'/>
					</div>
					<h4 className="badgeText">PONG WHISPERER</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chatterBox} className='badgeimage'/>
					</div>
					<h4 className="badgeText">CHATTERBOX</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={social} className='badgeimage'/>
					</div>
					<h4 className="badgeText">SOCIAL BUTTERFLY</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={chameleon} className='badgeimage unearned'/>
					</div>
					<h4 className="badgeText">CHAMELEON PLAYER</h4>
				</div>
				<div className="badges">
					<div className="badgeClass">
						<img src={rivalry} className='badgeimage unearned'/>
					</div>
					<h4 className="badgeText ">FRIENDLY RIVALRY</h4>
				</div>
				
				<div className="badges">
					<div className="badgeClass">
						<img src={fail} className='badgeimage'/>
					</div>
					<h4 className="badgeText">EPIC FAIL</h4>
				</div>
				
			</div>
		{/* {isFriendsVisible && (
			<div id="AllFriends" className="UsersSection">
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				<div className="fake-all-users"></div>
				
			</div>
		)} */}
	</div>
	);
  };
  
  export default Achievements;