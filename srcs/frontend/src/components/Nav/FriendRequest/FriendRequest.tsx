import './styles.css';
import axios from 'axios';
import { UserContext } from '../../../contexts'
import React, { useContext, useState, useEffect } from 'react';

type User = {
    avatar: string;
    userName: string;
    intraId: string;
	  isLogged: boolean;
  };
  


  
export function Request() {
    const [users, setUsers] = useState<User[]>([]);
    const {user} = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      console.log("naber, " + user.userName);
      try {
        const response = await axios.get('http://localhost:3001/user/all');
        setUsers(response.data);

        console.log("response fetch data!");
        console.log(response.data.user);
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
    {Array.isArray(users) ? (
      users.map((user, index) => (
        <div className="friendRequestcomponent" key={user.intraId}>
            <div className="imageClassFR">
              <img src={user.avatar} id="Avatar" alt=""/>
            </div>
            <div className="friendRequestUsername">{user.userName}</div>
            <div className='friendReject'>
              <i className="bi bi-x-lg fs-4"></i>
            </div>
            <div className='friendAccept'>
              <i className="bi bi-check2 fs-3"></i>
            </div>
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}