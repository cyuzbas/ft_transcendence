import React, { useEffect, useState, useContext} from 'react'
import logo from '../img/intra.png'
import '../index.css';
import axios from 'axios';
import { UserContext } from './Context/context';





type User = {
    avatar: string;
    username: string;
    intraId: string;
  };
  
  
  const Friend: React.FC = () => {
    // const [users, setUsers] = useState<User[]>([]);
    const {user, setUser} = useContext(UserContext)



    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get('http://localhost:3001/auth/status', {withCredentials: true})
        setUser(response.data);
        console.log(user.username)
        console.log(user.intraId)
        } catch (error) {
          window.location.href = '/login'
        }
      };
  
      fetchData();
    }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3001/user/all');
  //       setUsers(response.data);
  //       console.log("response fetch datA!");
  //       console.log(response.data.user);
  //       Array.isArray(users) ? (
  //           users.map((username, avatar) => (
  //               console.log(username + " and " + avatar)
  //           ))
  //    ) : (console.log("nobody!"))
  //     } catch (error) {
  //       console.error(error);
  //       console.log("ERRIR!!")
  //     }
  //   };

  //   fetchData();
  // }, []);

    return(
      <div></div>
      // <>
   
    );
}
export default Friend;


