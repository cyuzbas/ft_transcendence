import axios from "axios";
import { useState, useEffect } from "react";

const authToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];


  type Data = {
    avatar: string,
    username: string,
    intraID: string
  };
  
  const HomePage: React.FC = () => {
    const [data, setData] = useState<Data>({
      avatar : '',
      username : '',
      intraID : ''
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get(`http://localhost:3001/user/${authToken}`)
        setData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);
  

    return (
      <div>
        {/* <Image source={{uri:data.avatar}} style={{width: 400, height: 400, borderRadius:200}} /> */}
        <img src={data.avatar} style={{margin:50,width:200, height:200, borderRadius:150}} alt="" />
        <h1> {data.username}</h1>
        <h1> {data.intraID}</h1>
      </div>
    )
 }
 export default HomePage;