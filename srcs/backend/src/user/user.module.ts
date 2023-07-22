import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from '../typeorm/user.entity';
import {RoomEntity} from '../typeorm/room.entity';
import {RoomUserEntity} from '../typeorm/roomUser.entity';
import {MessageEntity} from '../typeorm/message.entity';
import { FriendsController } from './Friend/friends.controller';
import { FriendsService } from './Friend/friends.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RoomEntity, RoomUserEntity, MessageEntity])],
	providers: [UserService,FriendsService],
	controllers: [UserController, FriendsController],
	exports: [UserService],
})
export class UserModule {}
