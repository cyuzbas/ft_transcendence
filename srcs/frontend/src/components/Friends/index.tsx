import React, { useEffect, useState} from 'react'
// import '../index.css';
import axios from 'axios';

type User = {
    avatar: string;
    userName: string;
    intraId: string;
  };
  
  
export function Friends() {
    const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
        <div className="text-image-component" key={user.intraId}>
             <img src={user.avatar} className="image" style={{margin:5,width:50, height:50, borderRadius:20}}/>
            <div className="text">{user.userName}</div>
            {/* <img src={logo}  className="image2" /> */}
            <div>logo</div>
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}
