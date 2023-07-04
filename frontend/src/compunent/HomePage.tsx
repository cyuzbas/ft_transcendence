import React, { useContext,useState , useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import Friend from './friend';
import { UserContext } from './Context/context';
import swal from 'sweetalert';

  type Data = {
    avatar: string,
    username: string,
    intraId: string
  };
  
  const HomePage: React.FC = () => {

  
    const {user, setUser} = useContext(UserContext)
  

    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get('http://localhost:3001/auth/status', {withCredentials: true})
        setUser(response.data);
        console.log(response.data.intraId + " asdasd")
        } catch (error) {
          window.location.href = '/login'
        }
      };
  
      fetchData();
    }, []);

    async function showAlert(){
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to save",
        icon: "warning",
        dangerMode: true,
      })
      .then(async(willDelete) => {
        if (willDelete) {
          try{
          const response = await axios.post("http://localhost:3001/user/update-user-profile",{
            username:"veli",
            avatar: user.avatar,
            intraId: user.intraId
          })

          swal("Saved!", "Your imaginary file has been saved!" + user.intraId + "asdasd", "success");
        }
        catch(error){
          swal("error", "something go wrong" +error, "ok")
        }
        }
      });
    }
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    async function postimage() {
      if(selectedFile){
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await axios.post(
          "http://localhost:3001/user/avatar",
          formData,
          {
            withCredentials: true,
          }
        );

        console.log(response.data)
        setUser(response.data)
    }
    catch(error){
      console.error(error);
    }
  }
  }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
      }
    };


  
    return (
    <div className='PageMain'>
        <div className="Menu container">menu</div>
        <div className="ProfileInfo container">
        {/* <img src={imageUrl} alt="Avatar" style={{margin:50,width:200, height:170, borderRadius:20}} alt="" /> */}
        {/* <img src={user.avatar} alt="Avatar" /> */}
        <img src="http://localhost:3001/2.png" alt="Logo" />

        <h5> {user.intraId} intra</h5>
        <h5>{user.username}</h5>
        <button onClick={showAlert}> Change username</button>
        <input type='file' onChange={handleFileChange} accept='image/*' />
        <button onClick={postimage} > Change photo</button>
        </div>
        <div className="MyRank container">MyRank</div>
        <div className="Chat container">Chat</div>
        <div className="AllRanks container">Allranks</div>
        <div className="FriendSection container">
            <Friend/>
        </div>
    </div>
    )
};
export default HomePage;