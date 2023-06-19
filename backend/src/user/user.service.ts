import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {UserI} from './user.interface'
import {User} from './user.entity'
import { Repository } from 'typeorm';
import {CreateUserDTO} from '../dto/create-user-dto'



@Injectable()
export class UserService {
  constructor(
	@InjectRepository(User)
	private userRepository: Repository<User>,){}



	async addFriend(): Promise<boolean>{
		console.log("Add friends");
		const cicek = new User();
		cicek.id = 24;
		cicek.username = "cicek";

		const user = await this.userRepository.findOne({
			where: {id: 2}
		})
		
		// if(user){
		// 	console.log("user var " + user.intraID);
		// 	user.friends.push(cicek);
		// 	return true;
		// }
		return false;
	}

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

	async findByAllUser(): Promise<UserI[]> {
		console.log("find icinde!!\n");
		const users: User[] = await this.userRepository.find();
		console.log(users);
		return users as UserI[];
	}
}
