import './styles.css'
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Friends } from '../../components';
import { UserContext } from '../../contexts'
import swal from 'sweetalert';


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
    // <div className='PageMain'>
    //   <div id="item-0" className="ProfileInfo container">
    //     <img src={user.avatar} alt="Avatar" style={{ margin: 50, width: 200, height: 170, borderRadius: 20 }} />
    //     {/* <img src={user.avatar} /> */}

    //     {/* <img src={"undefined:undefined/upload/1688581369566-219674372.png"} alt="Logo" /> */}

    //     <h5>{user.userName}</h5>
    //     <h5> ID - {user.intraId}</h5>
    //     {/* <button onClick={showAlert}> Change userName</button>
    //     <input type='file' onChange={handleFileChange} accept='image/*' />
    //     <button onClick={postimage} > Change photo</button> */}
    //   </div>
    //   {/* <div className="MyRank container">MyRank</div> */}
    //   <div id="item-1" className="FriendSection container">
    //     <Friends />
    //   </div>
    //   <div id="item-2" className="LeaderBoard container">LeaderBoard</div>
    //   <div id="item-3" className="Achievement container">Achievement</div>
    // </div>
    <div className="PageMain">
      <div id="item-0" className="ProfileInfo item">&nbsp;
        <img src={user.avatar} alt="Avatar" style={{ margin: 50, width: 200, height: 160, borderRadius: 50 }} />
        <h5>{user.userName}</h5>
        <h5> ID - {user.intraId}</h5>
      </div>
      <div id="item-1" className="FriendSection item">&nbsp;
        Friends
        <Friends />
      </div>
      <div id="item-2" className="LeaderBoard item">&nbsp;LeaderBoard
      </div>
      <div id="item-3" className="Achievement item">&nbsp;Achievement
      </div>
    </div>
  )
};
