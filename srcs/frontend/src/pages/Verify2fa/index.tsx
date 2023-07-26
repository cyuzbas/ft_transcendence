import Particle from '../Login/Particle';
import swal from 'sweetalert';
import './styles.css'
import { useState, ChangeEvent, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts';

function Verify2fa() {

	const [inputText, setInputText] = useState("");

	const { user, setUser } = useContext(UserContext)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
		console.log(e.target.value)
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputText.length !== 6){
			console.error("wrong 2factor key!!")
			swal({
				title: "Error", 
				text: "Wrong Two Factor Key!",
				icon: "warning",
				dangerMode: true
			})
		}
		else {
			try {
				console.log("value is " + inputText + "user [" + JSON.stringify(user))
				const response = await axios.get(`http://localhost:3001/auth/verify/${inputText}/${user.intraId}`, { withCredentials: true });
				if (response.data === true) {
					console.log("correct auth");
					// user.twoFactorCorrect = true
					const updatedUser = { ...user, twoFactorCorrect: true };
					setUser(updatedUser);
					localStorage.setItem('user', JSON.stringify(updatedUser));
					window.location.href = "http://localhost:3000/home"


				} else {
					console.log("AUTH2FA ERssROR!!");
				}
				console.log("helllllopoooo" + JSON.stringify(user))

			}
			catch (error) {
				console.error(error)
				swal({
					title: "Error", 
					text: "Something went wrong!",
					icon: "warning",
					dangerMode: true
				})
			}
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
					<form className="LoginScannedCode" onSubmit={handleSubmit}>
						<input
							value={inputText}
							onChange={handleChange}
							className="LoginScannedCodeInput"
							type="text"
							placeholder="* Enter Generated Code"
						/>
						<button className="LoginSend2faButton">
							<i className="bi bi-send fs-3 LoginSend2fa"></i>
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Verify2fa;