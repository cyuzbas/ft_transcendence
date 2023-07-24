import './styles.css';
import axios from 'axios';
import { UserContext } from '../../contexts'
import { Link } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';

type User = {
    avatar: string;
    userName: string;
    intraId: string;
	  isLogged: boolean;
  };
  
export function Friends() {
    const [users, setUsers] = useState<User[]>([]);
    const {user} = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/all');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
        console.log("ERROR!!")
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
              <img src={user.avatar} id="Avatar" alt="Avatar"/>
            </div>
            <div className="friend-component-userName">{user.userName}</div>
            <div className="friend-component-userID">
              <Link to={`/profile/${user.intraId}`} className="visitUserProfile">{user.intraId}</Link>
            </div>
            <div className='personOnlineContainer'>
              <i className="bi bi-circle-fill fs-5"
                id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            </div>
            <div className='personAddContainer'>
              <i className="bi bi-person-add fs-3"></i>
              {/* <i className="bi bi-person-dash fs-3"></i> */}
              {/* <i className="bi bi-person-check fs-3"></i> */}
            </div>
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}
