import './styles.css';
import axios from 'axios';
import { UserContext } from '../../contexts'
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


enum userStatus {
  friends,
  nonFriends,
  query,
  me
};

type User = {
  avatar: string;
  userName: string;
  intraId: string;
  intraName: string;
  isLogged: boolean;
  userStatus: userStatus
};

export function Friends() {

  const [users, setUsers] = useState<User[]>([]);
  const { user } = useContext(UserContext)

  async function sendRequest(intraId: string) {
    console.log("send request " + intraId + user.intraId)
    try {
      const response = await axios.post(`http://localhost:3001/friends/add/${user.intraId}/${intraId}`)
      console.log("send friend request!");
      getData()
    }
    catch (error) {
      console.error(error);
    }

  }

  async function removeFriend(intraId: string) {
    try {
      const response = await axios.post(`http://localhost:3001/friends/delete/${user.intraId}/${intraId}`)
      console.log(response.data)
      getData()
    }
    catch (error) {
      console.error(error);
    }
  }

  async function getData() {
    try {
      const response = await axios.get(`http://localhost:3001/friends/allUser/${user.intraId}`);
      const { friends, nonFriends, me, query } = response.data;

      const usersData = [...friends.map((friend: User) => ({ ...friend, userStatus: userStatus.friends })),
      ...nonFriends.map((nonFriend: User) => ({ ...nonFriend, userStatus: userStatus.nonFriends })),
      ...query.map((query:User) =>({...query, userStatus: userStatus.query})),
      ...me.map((meUser: User) => ({ ...meUser, userStatus: userStatus.me }))];

      setUsers(usersData);
      console.log(JSON.stringify(users))
    } catch (error) {
      console.error(error);
      console.log("ERROR!!")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("naber, " + user.userName);
      getData()    
    };

    fetchData();
  }, []);

  return (
    <>
      {Array.isArray(users) ? (
        users.map((user, index) => (

          <div className="friends-text-image-component" key={user.avatar}>
            <div className="imageClassPP">
              <img src={user.avatar} id="Avatar" alt="" />
            </div>
            <div className="friend-component-userName">{user.userName}</div>
            <div className="friend-component-intraName">
              <Link to={`/profile/${user.intraName}`} className="visitUserProfile">{user.intraName}</Link>
            </div>
            <div className='personOnlineContainer'>
              <i className="bi bi-circle-fill fs-5"
                id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            </div>
            <div className='personAddContainer'>
              { (user.userStatus === 0) ? (
                  <i className="bi bi-person-dash fs-3" onClick={(e) => removeFriend(user.intraId)} />) :
                (user.userStatus === 1) ? (
                  <i className="bi bi-person-add fs-3" onClick={(e) => sendRequest(user.intraId,)} />) :
                (user.userStatus == 2)? (
                  <i className="bi bi-person-check fs-3"/> ) : <></>
              }
            </div>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </>
  );
}