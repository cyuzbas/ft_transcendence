import { Controller, Get, Res, Req, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard, OAuthGuard } from './oauth/oauth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as qrcode from 'qrcode';
import { AfterLoad } from 'typeorm';


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
		this.userService.updateLogIn(req.user.userName, false)
		console.log("logout calisti")
		req.logout(() => {
			res.redirect('http://localhost:3000/login');
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
		this.userService.updateLogIn(user.userName,true);
		console.log("redirect : " + JSON.stringify(user));
		if(user.TwoFactorAuth)
			res.redirect(`http://localhost:3000/verify2fa`)
		else
			res.redirect(`http://localhost:3000/home`);
	}


	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req) {
		if(!req.user){
			window.location.href = '/login'
		}
		else
			return req.user;
	}




	@Get('enable2fa')
	@UseGuards(AuthenticatedGuard)
	async enableTwoFactor(@Req() req, @Res() res) {
		const tfa = await this.authService.generateTwoFactorAuthenticationSecret(req.user) 
		console.log("tfa is : " +tfa + req.user.twoFactorAuthSecret.lenght)
		const qrCodeBuffer = await qrcode.toBuffer(tfa.qrCode);
		res.set('Content-type', 'image/png');
		res.send(qrCodeBuffer);
	}
	

	@Get('verify/:token/:intraId')
	@UseGuards(AuthenticatedGuard)
	async verifyToken(@Param('token') token: string, @Param('intraId') intraId: string) {
		const user = await this.userService.findByintraIdEntitiy(intraId);
		const result = this.authService.verifyTwoFactorAuthentication(token, user.twoFactorAuthSecret);
		console.log(result);
		await this.userService.updateTwoFactorStatus(user.id, true)
		if (result)
			return true
		return false
	}

}