import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from '../typeorm/user.entity';
import {RoomEntity} from '../typeorm/room.entity';
import {RoomUserEntity} from '../typeorm/roomUser.entity';
import {MessageEntity} from '../typeorm/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RoomEntity, RoomUserEntity, MessageEntity])],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
