import { Injectable } from '@nestjs/common';
import { UserI } from '../user.interface'
import * as speakeasy from 'speakeasy';
import { UserEntity } from 'src/typeorm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async requestFriend(user: UserI, friend: UserI) {
        //first get before query
        user.requestedFriends = await this.getFriendsQuery(user.id);

        //check is it undefined or not
        if (user.requestedFriends === undefined)
            user.requestedFriends = [];

        user.requestedFriends = [...user.requestedFriends, friend];
        await this.userRepository.save(user)
    }


    async     deleteFriends(user: UserI, friend: UserI): Promise<Boolean> {
        user.friends = await this.getFriends(user.id)
        if(user.friends === undefined)
            return false;
            const index = user.friends.findIndex((getFriend) => getFriend.id === friend.id);
            //delete requestarray
            if (index !== -1) {
                user.friends.splice(index, 1);
                await this.userRepository.save(user);
            }
            else{
                console.log("index " + index);
                return false;
            }
            return true;
    }

    async friendRequestAnswer(user: UserI, friend: UserI, answer: Boolean): Promise<Boolean> {
        //answer == true(accept)
        user.requestedFriends = await this.getFriendsQuery(user.id)
        console.log(user.requestedFriends)
        const index = user.requestedFriends.findIndex((getFriend) => getFriend.id === friend.id);
        //delete requestarray
        if (index !== -1) {
            user.requestedFriends.splice(index, 1);
            await this.userRepository.save(user);
        }
        else{
            console.log("index " + index);
            return false;
        }

        if (answer) {
            user.friends = await this.getFriends(user.id)
            if(user.friends === undefined)
                user.friends = [];
            user.friends.push(friend)
            await this.userRepository.save(user)
            return true;
        }
        else {
            return true;
        }
    }

    async getFriends(userId: number): Promise<UserI[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.friends', 'friends')
            .where('user.id = :userId', { userId })
            .getOne();
        return user.friends;
    }


    async getFriendsQuery(userId: number): Promise<UserI[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.requestedFriends', 'requested')
            .where('user.id = :userId', { userId })
            .getOne();
        return user.requestedFriends;
    }

}
