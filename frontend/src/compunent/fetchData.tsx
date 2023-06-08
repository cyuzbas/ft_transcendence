import axios from "axios";
import { useState, useEffect } from "react";
import {Image} from 'react-native'

const authToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];


  type Data = {
    imageUrl: string,
    username: string,
    id: string
  };
  
  const DataDisplay: React.FC = () => {
    const [data, setData] = useState<Data>({
      imageUrl : '',
      username : '',
      id : ''
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
        <Image source={{uri:data.imageUrl}} style={{width: 400, height: 400, borderRadius:200}} />
      </div>
    )
 }
 export default DataDisplay;