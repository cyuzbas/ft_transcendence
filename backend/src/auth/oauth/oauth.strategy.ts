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
      clientID: 'u-s4t2ud-8b8dca27634bd870dbf549f91fe73169d9bf670b2843208aad550ba0529f728e',
      clientSecret: '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',
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
