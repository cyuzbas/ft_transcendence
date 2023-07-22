
import './styles.css';
import axios from 'axios';
import { UserContext } from '../../contexts'
import React, { useContext,useState , useEffect } from 'react';
// import logo from './intra.png'

type User = {
    avatar: string;
    userName: string;
    intraId: string;
  };
  


  
export function Friends() {
    const [users, setUsers] = useState<User[]>([]);
    const {user, setUser} = useContext(UserContext)


  async function sendRequest(intraId:string) {
    try{
        const response = await axios.get(`http://localhost:3001/friends/add/${user.intraId}/${intraId}`)
        console.log("send friend request!");
    }
    catch(error){
      console.error(error);
    }
    
  }



  useEffect(() => {
    const fetchData = async () => {
      console.log("naber, " + user.userName);
      try {
        const response = await axios.get('http://localhost:3001/user/all');
        setUsers(response.data);

        console.log("response fetch datA!");
        console.log(response.data.user);
        Array.isArray(users) ? (
            users.map((userName, avatar) => (
                console.log(userName + " and " + avatar)
            ))
     ) : (console.log("nobody!"))
      } catch (error) {
        console.error(error);
        console.log("ERRIR!!")
      }
    };

    fetchData();
  }, []);

    return(
      <>
    {Array.isArray(users) ? (
      users.map((user, index) => (
        <div className="friends-text-image-component" key={user.intraId}>
            <div className="imageClassPP">
              <img src={user.avatar} id="Avatar"/>
            </div>
            <div className="friend-component-username">{user.userName}</div>
            <div className="friend-component-username"> ID - {user.intraId}</div>
            <div className='personaddcontainer' onClick={() => sendRequest(user.intraId)}>
              <i className="bi bi-person-add fs-3"></i>
            </div>
            {/* <img src={logo}  className="image2" /> */}
            {/* <div>logo</div> */}
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}
