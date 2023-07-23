import './style.css'
import React, { useContext } from 'react';
import { UserContext } from '../../contexts'
import pong from '../../img/pong.png';
import Achievements from '../Home/components/Achievements';
import MatchHistory from '../Home/components/MatchHistory/index';
import FriendsSection from '../Home/components/FriendsSection/index';


export function Profile() {


  const { user } = useContext(UserContext)


  return (

    <div className="PageProfile">
      <div id="item-0" className="ProfileSection item">&nbsp;
        <div className="ProfileInfo">
         <div className="imageClass">
            <img src={user.avatar} id="Avatar" alt="User Avatar"/>
          </div>
          <h4 className="UserName">{user.userName}</h4>
          <div className="ProfileStatusInfo">
            <i className="bi bi-circle-fill fs-5"  id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            {/* {!isGaming && user.isLogged && ( */}
              <h4 className="UserStatus">Online</h4> 
            {/* )} */}
            {/* {isGaming && user.isLogged && (
              <h4 className="UserStatus">In Game</h4> 
            )} */}
            {!user.isLogged && (
              <h4 className="UserStatus">Offline</h4> 
            )}
          </div>
        </div>
        <div className="ProfileRankInfo">
          <div className="ProfileRankInfoLine">
            <i className="bi bi-star fs-2"></i>
            <h4 className="UserScore">SCORE  - {user.score}</h4> {/*Data from Scoretable*/}
          </div>
          <div className="ProfileRankInfoLine">
            <i className="bi bi-chevron-double-up fs-2"></i>
            <h4 className="UserRank">RANK - {user.rank}</h4> {/*Data from Scoretable*/}
          </div>
        </div>
        <div className="ProfileMatchStats">
          <div id="MatchStatsTitle">&nbsp;
            <img src={pong} className='pongIcon'  alt='pong icon'/>
            <h4>MATCH STATS</h4>
            <img src={pong} className='pongIcon reverse' alt='pong icon'/>
          </div>
          <div id="MatchStatsWin">&nbsp;
            <h4>WIN</h4>
            <i className="bi bi-trophy fs-4"></i>
            <h4>{user.totalWin}</h4> {/*Data from Scoretable*/}
          </div>
          <div id="MatchStatsLoss">&nbsp;
            <h4>LOSS</h4>
            <i className="bi bi-x-lg fs-4"></i>
            <h4>{user.totalLoose}</h4>  {/*Data from Scoretable*/}
          </div>
        </div>
      </div>
      <div id="item-1" className="FriendSection item">
        <div className="Friend-UsersSection">
          <div className="title-box">
            <div className="ProfileComponentTitle">FRIENDS</div>
          </div>
          <FriendsSection/>
        </div>
      </div>
        <div id="item-2" className="LeaderBoard item">
          <div className="LeaderBoard-MatchHistorySection">
            <div className="title-box">
              <div className="ProfileComponentTitle">MATCH HISTORY</div>
            </div>
            <MatchHistory/>
          </div>
        </div>
      <div id="item-3" className="Achievement item">
        <Achievements/>
      </div>
    </div>
  )
};