import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {CreateUserDTO} from '../dto/create-user-dto'
import {UserI} from '../user/user.interface'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(createUserDto: CreateUserDTO): Promise<UserI> {
	
		const user = await this.userService.findByIntraID(createUserDto.intraID);
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

	

	async createToken(userId: string): Promise<string> {
		const payload = { userId };
		const expiresIn = '1h';
	
		const token = this.jwtService.sign(payload, { expiresIn });
	
		return token;
	}
}
