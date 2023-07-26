import './styles.css';
import axios from 'axios';
import { UserContext } from '../../../contexts'
import React, { useContext, useState, useEffect } from 'react';

type User = {
    avatar: string;
    userName: string;
    intraId: string;
	  isLogged: boolean;
	  score: number;
  };
  


  
export function Request() {
    const [users, setUsers] = useState<User[]>([]);
    const {user} = useContext(UserContext)

    const [friendRequest, setFriendRequest] = useState<boolean | null>(null);


  async function answerRequest(intraId:string, answer:string) {
    try{
          const response = await axios.post(`http://localhost:3001/friends/friend-request/${user.intraId}/${intraId}/${answer}`)
          const updatedUsers = users.filter((user) => user.intraId !== intraId);
          setUsers(updatedUsers);
      
      
          console.log(response.data)
    }
    catch(error){
      console.error(error);
    }
    
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("naber, " + user.userName);
      try {
        const response = await axios.get(`http://localhost:3001/friends/getFriendQuery/${user.intraId}`);
        setUsers(response.data);
        setFriendRequest(response.data.length == 0 ? false : true)
        console.log("burdayiz " + users.length)
        console.log(JSON.stringify(users))
        console.log("response fetch data!");
        // console.log(response.data.user);
        Array.isArray(users) ? (
            users.map((userName, avatar) => (
                console.log(userName + " and " + avatar)
            ))
     ) : (console.log("nobody!"))
      } catch (error) {
        console.error(error);
        console.log("ERROR!!")
      }
    };

    fetchData();
  }, []);

    return(
      <>
    {friendRequest ?(
      
      users.map((user, index) => (
        <div className="friendRequestcomponent" key={user.intraId}>
            <div className="imageClassFR">
              <img src={user.avatar} id="Avatar" alt=""/>
            </div>
            <div className="friendRequestUsername">{user.userName}</div>
            <div className='friendReject'>
              <i className="bi bi-x-lg fs-4" onClick={(e) => answerRequest(user.intraId, "false")}/>
            </div>
            <div className='friendAccept'>
              <i className="bi bi-check2 fs-3" onClick={(e) => answerRequest(user.intraId, "true")}/>

            </div>
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}