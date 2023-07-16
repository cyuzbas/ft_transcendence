import './styles.css'
import Intra from '../../img/ft.png';

function Auth2faPage() {


	return (
		<div className="Auth2faPage">
			<div className="Auth2faContainer">
				<h5>Please scan the QR with</h5> 
				<h5>'Google Authenticator' app</h5>
				<h5>and input the generated code</h5>
				<img src={Intra} className='QRimage'/>
				<form className="ScannedCode">
					<input 
						className="ScannedCodeInput"
						type="text" 
						placeholder="* Enter Generated Code"
						/>
					<button className="Send2faButton">
						<i className="bi bi-send fs-3 Send2fa"></i>
					</button>
				</form>
			</div>

		</div>
	);
};

export default Auth2faPage;