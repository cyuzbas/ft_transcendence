import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      callbackURL: 'http://localhost:3001/auth/redirect',
    });
  }
 
	  async validate(accessToken: string) {
		const data = await this.httpService
			.get('https://api.intra.42.fr/v2/me', {
				headers: { Authorization: `Bearer ${accessToken}` },
			})
			.toPromise();
      console.log(accessToken);
		const intraID = data.data.id;
    const username = data.data.first_name;
    const avatar = data.data.image.link;
		const validateUserDto = { intraID, username, avatar };
    console.log(validateUserDto)
    return await this.authService.validateUser(validateUserDto);
  }
	
}
