import './styles.css'
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { UserContext } from '../../contexts'
import { Settings } from '../../contexts/SettingsContext/types';

function SettingsPage() {


	const { user, setUser } = useContext(UserContext)


	useEffect(() => {
	  console.log("settings")
	})
  
	async function showAlert() {
	  swal({
		title: "Are you sure?",
		text: "Are you sure that you want to save",
		icon: "warning",
		dangerMode: true,
	  })
		.then(async (willDelete) => {
		  if (willDelete) {
			try {
			  const response = await axios.post("http://localhost:3001/user/update-user-profile", {
				userName: "cicek",
				avatar: user.avatar,
				intraId: user.intraId
			  }, { withCredentials: true })
  
			  swal("Saved!", "Your imaginary file has been saved!" + user.intraId + "asdasd", "success");
			}
			catch (error) {
			  swal("error", "something go wrong" + error, "ok")
			}
		  }
		});
	}
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  
	async function postimage() {
  
	  if (selectedFile) {
		const formData = new FormData()
		const imageName = user.userName + '.png'
		formData.append('avatar', selectedFile)
		const headers = { 'Content-Type': 'multipart/form-data' };
		await axios
		  .post(`http://localhost:3001/user/avatar/${imageName}`,
			formData, { withCredentials: true, headers })
		  .then((res) => { user.avatar = res.data.avatar })
		  .catch(err => { })
	  }
	}
  
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  if (event.target.files && event.target.files.length > 0) {
		setSelectedFile(event.target.files[0]);
	  }
	};


	//2FA BUTTON STARTS HERE
	const [isEnabled, setIsEnabled] = useState(false);
	const [status, setStatus] = useState('Disable');
	
	const handleClick2FA = () => {
		if (isEnabled) {
			// 2FA CHECK HERE

			setStatus('Disable');
		} else {
			// QR SCREEN HERE
			setStatus('Enable');
		}
		window.location.href = 'http://localhost:3000/2fa';
		setIsEnabled(!isEnabled);
	};
  
	return (
  
		<div className="SettingsPageContent">
			<div className="SettingsPageContainer">
				<div className="ChangePP">
					<div className="imageContainer">
						<img src={user.avatar} className='profilePicture'  />
					</div>
					<div className="ChangePPLine">
						<button type="submit" className="SubmitButton" onClick={postimage}>
							<i className="bi bi-upload fs-2"></i>
							<h4>Upload Picture</h4>
						</button>
						
					</div>
					{/* <div className="ChangePPLine">
						<button type="submit" className="SubmitButton" onClick={postimage}>
							<i className="bi bi-images fs-2"></i>
							<h4>Choose Avatar</h4>
						</button>
					</div> */}
				</div>
				<div className="ChangeOthers">
					<div className="EditName">
						<form className="EnterName">
							<input 
								className="NameInput"
								type="text" 
								placeholder="* Change your name"
								/>
						</form>
						<button type="submit" className="SubmitButton Edit">
							<i className="bi bi-pen fs-5"></i>
							<h6>Edit</h6>
						</button>
					</div>
					<div className="Change2FA">
						<button type="submit" className="SubmitButton TwoFA" onClick={handleClick2FA}>
							<i className="bi bi-qr-code-scan fs-1"></i>
							<h4>{isEnabled ? 'Disable' : 'Enable'} 2FA</h4>
						</button>
					</div>
				</div>
			</div>
		</div>

	)
};

export default SettingsPage;