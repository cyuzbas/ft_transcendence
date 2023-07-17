import Particle from '../Login/Particle';
import fourtytwo from '../../img/ft.png'
import './styles.css'
import { useState, ChangeEvent, useContext } from 'react';
import axios from 'axios';
import { User, UserContext } from '../../contexts';

function Verify2fa() {

	const [inputText, setInputText] = useState("");

	const { user, setUser } = useContext(UserContext)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		// 👇 Store the input value to local state
		setInputText(e.target.value);
		console.log(e.target.value)
	};

	async function sendKey() {
		try {
			console.log("value is " + inputText + "user [" + JSON.stringify(user))
			const response = await axios.get(`http://localhost:3001/auth/verify/${inputText}/${user.intraId}`);
			if (response.data === true) {
				console.log("correct auth");
				// user.twoFactorCorrect = true
				const updatedUser = { ...user, twoFactorCorrect: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));

			
			} else {
				console.log("AUTH2FA ERROR!!");
			}
			console.log("helllllopoooo" + JSON.stringify(user))

		}
		catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<Particle />
			<div className="Auth2faLoginPage">
				<div className="Auth2faLoginContainer">
					<h3>Two-Factor Authentication</h3>
					<h5>Open the 'Google Authenticator' app</h5>
					<h5>and input the generated code</h5>
					<form className="LoginScannedCode">
						<input
							value={inputText}
							onChange={handleChange}
							className="LoginScannedCodeInput"
							type="text"
							placeholder="* Enter Generated Code"
						/>

					</form>
					<button className="bi bi-send fs-3 LoginSend2fa" onClick={sendKey}/>
				
				</div>

			</div>
		</>
	);
};

export default Verify2fa;