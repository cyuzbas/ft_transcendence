import { RoomType } from "src/typeorm/room.entity";
import { UserRole } from "src/typeorm/roomUser.entity";

export class RoomDto {
	roomId?: number;
	roomName: string;
	type: RoomType;
	userName?: string;
	// description?: string;
	// admin?: string[];
	member?: string[];
	password?: string;
}

export class NewRoomDto {
	userName: string;
	member?: string[];
	password?: string;
}





// contact?: string;
// id: number;
// userRole?: UserRole;

// memberNames?: string[];
// password?: string;
// dmContact?: string;

// export class newChannelDto extends ChannelDto {
// 	ownerName: string;
// 	adminNames?: string[];
// }

// export class userChannelsDto extends ChannelDto {
// 	userRole: string;
// }

// export class dmChannelDto extends ChannelDto {
// 	memberNames: string[];
// 	contact: string;
// }
