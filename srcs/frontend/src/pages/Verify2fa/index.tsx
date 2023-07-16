import Particle from '../Login/Particle';
import fourtytwo from '../../img/ft.png'
import './styles.css'

function Verify2fa(){

	return (
		<>
		<Particle/>
		<div className="Auth2faLoginPage">
			<div className="Auth2faLoginContainer">
				<h3>Two-Factor Authentication</h3> 
				<h5>Open the 'Google Authenticator' app</h5>
				<h5>and input the generated code</h5>
				<form className="LoginScannedCode">
					<input 
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