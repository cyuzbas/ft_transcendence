import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {UserI} from './user.interface'
import User from './user.entity'
import { Repository, getConnection } from 'typeorm';
import {CreateUserDTO} from '../dto/create-user-dto'



@Injectable()
export class UserService {
  constructor(
	@InjectRepository(User)
	private userRepository: Repository<User>,){}


  async createUser(userData: CreateUserDTO): Promise<UserI> {
		const newUser = this.userRepository.create(userData);
		const createdUser: UserI = await this.userRepository.save(newUser);

		return createdUser;
	}

	async findByIntraID(intraIDToFind: string): Promise<UserI> {
		return await this.userRepository.findOne({
			where: { intraID: intraIDToFind },
		});
	}


}
