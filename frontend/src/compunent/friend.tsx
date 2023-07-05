import React, { useEffect, useState} from 'react'
import logo from '../img/intra.png'
import '../index.css';
import axios from 'axios';




type User = {
    avatar: string;
    username: string;
    intraId: string;
  };
  
  
  const Friend: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/all');
        setUsers(response.data);
        console.log("response fetch datA!");
        console.log(response.data.user);
        Array.isArray(users) ? (
            users.map((username, avatar) => (
                console.log(username + " and " + avatar)
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
            <div className="text">{user.username}</div>
            <img src={logo}  className="image2" />
        </div>
      ))
    ) : (
      <p>No users found</p>
    )}
    </>
    );
}
export default Friend;


