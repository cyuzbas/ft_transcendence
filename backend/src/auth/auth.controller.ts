import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard, OAuthGuard } from './oauth/oauth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor(private userService: UserService,  
		private authService: AuthService) {}
	
	@Get('login')
	@UseGuards(OAuthGuard)
	login() {
		return ;
	}



	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	async logout(@Req() req, @Res() res) {
		req.logout(() => {
			// Oturum sonlandırıldıktan sonra yapılacak işlemler
			res.redirect('http://localhost:3000/login'); // Örnek olarak, login sayfasına yönlendirme yapabilirsiniz
		  });
	}

	@Get('redirect')
	@UseGuards(OAuthGuard)
	async callback(@Req() req, @Res() res)
	{
		const user = req.user;
		req.login(user, (err) => {
			if(err){
				console.log("Login Error");
			}
			else
				console.log("Login succes");
		});

		res.redirect(`http://localhost:3000/`);
	}


	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req) {
		if(!req.user)
			window.location.href = '/login'
		else
			return req.user;
	}

}
