import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {CreateUserDTO} from '../dto/create-user-dto'
import {UserI} from '../user/user.interface'
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
  ) {}

  async validateUser(createUserDto: CreateUserDTO): Promise<UserI> {
	
		const user = await this.userService.findByintraId(createUserDto.intraId);
		if(user)
		{
			console.log("old user");
			return user;
		}
		else{
		console.log("new user");
		return await this.registerUser(createUserDto);
	}
	}

  private async registerUser(createUserDto: CreateUserDTO): Promise<UserI> {
		
		return await this.userService.createUser(createUserDto);
	}

	async generateTwoFactorAuthenticationSecret(user: UserI) {
		const secret = speakeasy.generateSecret({ length: 20 });
		console.log(secret.base32 + " burda")
		await this.userService.addAuthSecretKey(secret.base32, user)
		const qrCode = speakeasy.otpauthURL({
			secret: secret.ascii,
			label: user.userName,
			issuer: 'Cida-trans',
		});
		return { qrCode, secret: secret.base32 }
	}

	verifyTwoFactorAuthentication(twoFactorCode: string, userSecret: string): boolean {
		const verified = speakeasy.totp.verify({
			secret: userSecret,
			encoding: 'base32',
			token: twoFactorCode,
		});
		return verified;
	}



	
}
