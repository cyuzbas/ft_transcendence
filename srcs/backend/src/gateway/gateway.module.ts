import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { ChatService } from "src/chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/typeorm/user.entity";
import { RoomEntity } from "src/typeorm/room.entity";
import { MessageEntity } from "src/typeorm/message.entity";
import { UserService } from "src/user/user.service";
import { RoomUserEntity } from "src/typeorm/roomUser.entity";
import { ACHIEVEMENTSEntity } from "src/typeorm/achievements.entity";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity, RoomUserEntity, MessageEntity, ACHIEVEMENTSEntity])],
	providers: [MyGateway, ChatService, UserService]
})
export class GatewayModule{}