import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User } from './user.entity'
import {CreateUserDTO} from '../dto/create-user-dto'
import { UserDTO } from 'src/dto/task.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private UserRepository: Repository<User>){}

    public async createOne(createUserRequest: CreateUserDTO){
        const user: User = new User();
        user.is_online  = createUserRequest.is_online;
        user.nick_name = createUserRequest.nick_name;
        user.password = createUserRequest.password;
        user.user_id = createUserRequest.user_id;

        await this.UserRepository.save(user);

        const userDTO = new UserDTO();
        userDTO.is_online = user.is_online;
        userDTO.nick_name = user.nick_name;
        userDTO.password = user.password;
        userDTO.user_id = user.user_id;

        return userDTO;
    }
}
