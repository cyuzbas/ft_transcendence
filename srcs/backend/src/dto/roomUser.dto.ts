import { RoomType } from "src/typeorm/room.entity";
import { UserRole } from "src/typeorm/roomUser.entity";

export class RoomUserDto {
	roomId?: number;
	roomName?: string;
	type?: RoomType;
	unreadMessages?: number;
	userName?: string;
	contact?: string;
	userRole?: UserRole;
	isMuted?: boolean;
	isKicked?: boolean;
	isBanned?: boolean;
	status?: string;
}



// export class ChatRoomUserDto { //extends type room or roomuser?
//   userRole: UserRole;
//   isMuted: boolean;
//   isKicked: boolean;
//   isBanned: boolean;
// }

// export class DmRoomUserDto {
//   userName: string;
//   contact: string; 
// }

// export class MemberRoomUserDto {
//   id: number;
//   userName: string;
//   userRole: UserRole;
//   isMuted: boolean;
//   isKicked: boolean;
//   isBanned: boolean;
//   status: string;
// }
