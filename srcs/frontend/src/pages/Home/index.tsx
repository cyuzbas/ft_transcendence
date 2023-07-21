import './styles.css'
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Friends } from '../../components';
import { UserContext } from '../../contexts'
import FriendsToggle from './components/UserToggle';
import Achievements from './components/Achievements';
import Leaderboard from './components/Leaderboard';
import swal from 'sweetalert';
import pong from '../../img/pong.png';


export function Home() {


  const { user, setUser } = useContext(UserContext)


  useEffect(() => {
    console.log("home")
  })

  async function showAlert() {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to save",
      icon: "warning",
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await axios.post("http://localhost:3001/user/update-user-profile", {
              userName: "cicek",
              avatar: user.avatar,
              intraId: user.intraId
            }, { withCredentials: true })

            swal("Saved!", "Your name has been saved!");
          }
          catch (error) {
            swal("error", "something go wrong" + error, "ok")
          }
        }
      });
  }


  return (

    <div className="PageMain">
      <div id="item-0" className="ProfileSection item">&nbsp;
        <div className="ProfileInfo">
         <div className="imageClass">
            <img src={user.avatar} id="Avatar"/>
          </div>
          <h4 className="UserName">{user.userName}</h4>
          <h4 className="UserID"> ID - {user.intraId}</h4>
        </div>
        <div className="ProfileRankInfo">
          <div className="ProfileRankInfoLine">
            <i className="bi bi-star fs-2"></i>
            <h4 className="UserScore">SCORE</h4> {/*Data from Scoretable*/}
          </div>
          <div className="ProfileRankInfoLine">
            <i className="bi bi-chevron-double-up fs-2"></i>
            <h4 className="UserRank">RANK </h4> {/*Data from Scoretable*/}
          </div>
        </div>
        <div className="ProfileMatchHistory">
          <div id="MatchHistoryTitle">&nbsp;
            <img src={pong} className='pongIcon'/>
            <h4>MATCH STATS</h4>
            <img src={pong} className='pongIcon reverse'/>
          </div>
          <div id="MatchHistoryWin">&nbsp;
            <h4>WIN</h4>
            <i className="bi bi-trophy fs-4"></i>
            <h4>2</h4> {/*Data from Scoretable*/}
          </div>
          <div id="MatchHistoryLoss">&nbsp;
            <h4>LOSS</h4>
            <i className="bi bi-x-lg fs-4"></i>
            <h4>1</h4>  {/*Data from Scoretable*/}
          </div>
        </div>
      </div>
      <div id="item-1" className="FriendSection item">
        <FriendsToggle />
      </div>
      <div id="item-2" className="LeaderBoard item">
        <Leaderboard/>
      </div>
      <div id="item-3" className="Achievement item">
        <Achievements/>
      </div>
    </div>
  )
};
