import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {UserI} from './user.interface'
import User from './user.entity'
import { Repository, getConnection } from 'typeorm';
import {CreateUserDTO} from '../dto/create-user-dto'
import { UpdateUserProfileDto } from './updateUserProfil.dto';
import { log } from 'console';



@Injectable()
export class UserService {
  constructor(
	@InjectRepository(User)
	private userRepository: Repository<User>,){}



  async createUser(userData: CreateUserDTO): Promise<UserI> {
	const newUser = this.userRepository.create(userData);
	newUser.friends = []
	const createdUser: UserI = await this.userRepository.save(newUser);


	return createdUser;
	}

	async findByintraId(intraIdToFind: string): Promise<UserI> {
		return await this.userRepository.findOne({
			where: { intraId: intraIdToFind },
		});
	}

	async findByAllUser(): Promise<UserI[]> {
		const users: User[] = await this.userRepository.find();
		return users as UserI[];
	}

	async findByID(idToFind: number): Promise<UserI> {
		return await this.userRepository.findOne({
			where: { id: idToFind },
		});
	}

	async findId(intrabyId: string): Promise<number>{
		const user  = await this.userRepository.findOne({
			where: {intraId: intrabyId}
		})
		return user.id;
	}

	async updataAvatar(path: string, user: User): Promise<UserI>{
		try{
			await this.userRepository.update(user,{
				avatar: path
			});
			console.log("succes update avatar");
			return user;
		}
		catch(error){
			console.error(error + "error update avatar");
			return null;
		}
	}

	async updateUserProfile(updateUserInfo: UpdateUserProfileDto): Promise<UserI | undefined> {
		try {
		  const id = await this.findId(updateUserInfo.intraId); // findId fonksiyonunun tamamlanmasını bekleyin
		  console.log(id + " da " + updateUserInfo.avatar);
	  
		  await this.userRepository.update(id, {
			username: updateUserInfo.username,
		  });
		  
		  console.log("kaydetme başarılı");
		  return await this.findByID(updateUserInfo.id);
		} catch (error) {
		  console.log("hata: " + error);
		  return undefined;
		}
	  }
	  
}
