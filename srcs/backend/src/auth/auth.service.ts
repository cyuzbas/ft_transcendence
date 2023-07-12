import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {CreateUserDTO} from '../dto/create-user-dto'
import {UserI} from '../user/user.interface'

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

	
}
