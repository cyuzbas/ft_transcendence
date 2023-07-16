import './styles.css'
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Friends } from '../../components';
import { UserContext } from '../../contexts'
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

            swal("Saved!", "Your imaginary file has been saved!" + user.intraId + "asdasd", "success");
          }
          catch (error) {
            swal("error", "something go wrong" + error, "ok")
          }
        }
      });
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  async function postimage() {

    if (selectedFile) {
      const formData = new FormData()
      const imageName = user.userName + '.png'
      formData.append('avatar', selectedFile)
      const headers = { 'Content-Type': 'multipart/form-data' };
      await axios
        .post(`http://localhost:3001/user/avatar/${imageName}`,
          formData, { withCredentials: true, headers })
        .then((res) => { user.avatar = res.data.avatar })
        .catch(err => { })
    }
  }



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };



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
            <h4 className="UserScore">SCORE</h4>
          </div>
          <div className="ProfileRankInfoLine">
            <i className="bi bi-chevron-double-up fs-2"></i>
            <h4 className="UserRank">RANK </h4>
          </div>
        </div>
        <div className="ProfileMatchHistory">
          <div id="MatchHistoryTitle">&nbsp;
            <img src={pong} className='pongIcon'/>
            <h4>Match History</h4>
            <img src={pong} className='pongIcon reverse'/>
          </div>
          <div id="MatchHistoryWin">&nbsp;
            <h4>WIN</h4>
            <i className="bi bi-trophy fs-4"></i>
            <h4>2</h4>
          </div>
          <div id="MatchHistoryLoss">&nbsp;
            <h4>LOSS</h4>
            <i className="bi bi-x-lg fs-4"></i>
            <h4>1</h4>
          </div>
        </div>
      </div>
      <div id="item-1" className="FriendSection item">&nbsp;
        All users / Friends
        <Friends />
      </div>
      <div id="item-2" className="LeaderBoard item">&nbsp;LeaderBoard
      </div>
      <div id="item-3" className="Achievement item">&nbsp;Achievement
      </div>
    </div>
  )
};
