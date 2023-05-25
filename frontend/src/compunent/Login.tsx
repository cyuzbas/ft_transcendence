import React, { useState } from 'react';
import axios from 'axios';
// import { OAuth2Client } from 'oauth2-client';






// const clientId = 'u-s4t2ud-abe60458fc8bed380ffb209bcfe0eaaf653fa06e185f7ac4f0fb307132134bfe';
// const clientSecret = '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';
// const authorizationUrl = 'http://localhost:3000';

// const oauth2Client = new OAuth2Client({
//   clientId,
//   clientSecret,
//   authorizationUrl,
// });

// // Kullanıcıyı yetkilendirme sayfasına yönlendirme
// function redirectToAuthorization() {
//   const authorizationUri = oauth2Client.getAuthorizationUri();
//   window.location.href = authorizationUri;
// }

// // Yetkilendirme kodunu alıp erişim tokenini alma
// async function exchangeCodeForToken(code: string) {
//   const token = await oauth2Client.getToken(code);
//   // Erişim tokeni ile işlemler yapabilirsiniz
//   console.log('Access Token:', token.access_token);
// }

// // Örnek kullanım
// redirectToAuthorization(); // Kullanıcıyı yetkilendirme sayfasına yönlendirir

// // Yönlendirme sonrası, URL parametresinden yetkilendirme kodunu alarak token alımını gerçekleştirir
// const urlParams = new URLSearchParams(window.location.search);
// const code = urlParams.get('code');
// if (code) {
//   exchangeCodeForToken(code);
// }






const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    console.log('Email value is:', event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    console.log('Password value is:', event.target.value);
  };

  const handleClick = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    try {
        const data = { is_online: 'false', password: password, nick_name: email }; // Göndermek istediğiniz JSON veri
        const options = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await axios.post('http://localhost:3001/User/', data, options);
        setResponse(response.data);
      } catch (error) {
        console.error('POST request error:', error);
      }
  };

  return (
    <div className="Login">
      <div className="LoginBox">
        <div className="LoginHeader">Login</div>
        <div className="LoginInput">
          <input
            type="text"
            id="email"
            name="email"
            onChange={handleChangeEmail}
            className="email"
            value={email}
            placeholder="email"
          />
          <input
            value={password}
            onChange={handleChangePassword}
            id="password"
            className="password"
            placeholder="password"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="LoginButton" onClick={handleClick}>
            Login
          </button>
          <button>
            
         <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-abe60458fc8bed380ffb209bcfe0eaaf653fa06e185f7ac4f0fb307132134bfe&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code ">
      42 Intra Login
    </a>
  </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
