import Particle from '../Login/Particle';
import fourtytwo from '../../img/ft.png'
import './styles.css'
import { useState, ChangeEvent, useContext } from 'react';
import axios from 'axios';
import { User, UserContext } from '../../contexts';

function NotFound() {

	return (
		<>
			<Particle />
			<div className="NotFoundPage">
				<div className="NotFoundContainer">
					<h1>PAGE NOT FOUND!</h1>
					<h5>Something went wrong.</h5>
					<h5>Wanna go back to <a id="homeLink" href="/home">home</a> ?</h5>
				</div>
			</div>
		</>
	);
};

export default NotFound;