import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard, OAuthGuard } from './oauth/oauth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
<<<<<<< Updated upstream
	constructor(private userService: UserService, private readonly jwtService: JwtService,  private authService: AuthService) {}
	public jwtToken = {access_token: ''}; 
=======
	constructor(private userService: UserService,  
		private authService: AuthService) {}
>>>>>>> Stashed changes
	
	@Get('login')
	@UseGuards(OAuthGuard)
	login() {
		return ;
	}



	@Get('logout')
	async logout(@Req() req: any) {
		console.log("bastaaaaa \n\n" +req);
		req.logOut();
		console.log("sonda\n\n " + req);
		return '!';
	}

	@Get('redirect')
	@UseGuards(OAuthGuard)
	async callback(@Req() req, @Res() res)
	{
		console.log("burad " + req.user.intraID);
		// console.log(res);
		const jwtToken = this.authService.createToken(req.user.intraID);
		res.cookie("jwt", jwtToken);
		// res.cookie("jwtToken", jwtToken, {httpOnly:true});
		res.cookie('authToken',req.user.intraID);
		// res.redirect('http://localhost:3000/')
		res.redirect(`http://localhost:3000/?token=${jwtToken}`);
		// return res.json(req.user);
	}


	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req: Request) {
		return req.user;
	}

}
