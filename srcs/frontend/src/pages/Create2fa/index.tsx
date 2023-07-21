import './styles.css'
import Intra from '../../img/ft.png';
import { useContext, ChangeEvent, useState } from 'react';
import axios from 'axios';
import QRCodeImage from './qrCodeCreate';
import { UserContext } from '../../contexts';

function Auth2faPage() {
	const [inputText, setInputText] = useState("");

	const { user, setUser } = useContext(UserContext)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		// 👇 Store the input value to local state
		setInputText(e.target.value);
		console.log(e.target.value)
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputText.length != 6)
			console.error("wrong 2factor key!!")
		else {
			try {
				console.log("value is " + inputText + "user [" + JSON.stringify(user))
				const response = await axios.get(`http://localhost:3001/auth/verify/${inputText}/${user.intraId}`,{withCredentials:true});
				if (response.data === true) {
					console.log("correct auth");
					// user.twoFactorCorrect = true

					const updatedUser = { ...user, twoFactorCorrect: true, TwoFactorAuth:true };
					setUser(updatedUser);
					localStorage.setItem('user', JSON.stringify(updatedUser));
					window.location.href ='http://localhost:3000/settings'

				} else {
					console.log("AUTH2FA ERROR!!");
				}
				console.log("helllllopoooo" + JSON.stringify(user))

			}
			catch (error) {
				console.error(error)
			}
		}
	}


	return (
		<div className="Auth2faPage">
			<div className="Auth2faContainer">
				<h5>Please scan the QR with</h5>
				<h5>'Google Authenticator' app</h5>
				<h5>and input the generated code</h5>
				<QRCodeImage />
				<form className="ScannedCode" onSubmit={handleSubmit}>
					<input
						value={inputText}
						onChange={handleChange}
						className="ScannedCodeInput"
						type="text"
						placeholder="* Enter Generated Code"
					/>
					<button className="Send2faButton" type="submit">
						<i className="bi bi-send fs-3 Send2fa"></i>
					</button>
				</form>
			</div>
		</div>
	);
};

export default Auth2faPage;
