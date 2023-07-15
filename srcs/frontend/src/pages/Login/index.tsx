import Particle from './Particle';
import fourtytwo from '../../img/ft.png'
import './styles.css'

export function Login(){

	const goToLogin= async () =>{
		window.location.href = 'http://localhost:3001/auth/login';
	}

	return (
		<>
		<Particle/>
		<div className='LoginPageContent'>
			<div className='LoginIntro'>
				<h1>FT_TRANSCENDENCE</h1>
			</div>
			<button className='LoginWith42' onClick={goToLogin} >
				<img src={fourtytwo} className='ftLogo'></img>
				<text className='ftLogin-text'>LOGIN WITH 42</text>
			</button>
		</div>
		</>
	);
  };
  
