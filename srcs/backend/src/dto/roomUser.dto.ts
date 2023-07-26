import { RoomType } from "src/typeorm/room.entity";
import { UserRole } from "src/typeorm/roomUser.entity";
import { UserDto } from "./user.dto";

export class RoomUserDto {
	roomId?: number;
	roomName?: string;
	userName?: string;
	intraId?: string;
	type?: RoomType;
	unreadMessages?: number;
	userRole?: UserRole;
	isMuted?: boolean;
	muteEndTime?: Date;
	isKicked?: boolean;
	isBanned?: boolean;
	contactName?: string;
	status?: string;
}

export class NewRoomUserDto {
	roomName: string;
	userName: string;
	userRole: UserRole;
	intraId: string;
	contactName?: string;
};



// import { User } from "../UserContext";

// export enum RoomType {
// 	PUBLIC = 'public',
// 	PRIVATE = 'private',
// 	PROTECTED = 'protected',
// 	DIRECTMESSAGE = 'directmessage',
// }

// export enum UserRole {
//     OWNER = 'owner',
//     ADMIN = 'admin',
//     MEMBER = 'member'
// }

// export const GENERAL_CHAT = {
// 	roomId: 1,
// 	roomName: 'Transcendence',
// 	unreadMessages: 0,
// 	type: RoomType.PUBLIC,
// 	userRole: UserRole.MEMBER,
// }
// export type Message = {
// 	id: number,
// 	userName: string,
// 	content: string,
// 	roomName: string,
// }

// export type Room = { //newRoom?
// 	roomId?: number;
// 	roomName: string;
// 	type: RoomType;
// 	userName?: string;
// 	description?: string;
// 	member?: string[];
// 	password?: string;
// }
	
// // Base RoomUser type
// export type RoomUser = {
// 	roomId: number;
// 	roomName: string;
// 	type: RoomType;
// 	unreadMessages: number;
// };

// // Base User type
// // export type User = {
// // 	id: number;
// // 	userName: string;
// // 	status: string;
// // 	avatar: string;
// // 	intraId: string;
// // };

// // UserRoles type
// export type RoomUserDetails = {
// 	userRole: UserRole;
// 	isMuted: boolean;
// 	isKicked: boolean;
// 	isBanned: boolean;
// };

// // Specific RoomUser types
// export type ChatRoomUser = RoomUser & RoomUserDetails;
// export type DmRoomUser = RoomUser & { contact: string, userName: string};

// // Member type
// export type Member = User & RoomUserDetails;

// // export class ChatRoomUserDto { //extends type room or roomuser?
// //   userRole: UserRole;
// //   isMuted: boolean;
// //   isKicked: boolean;
// //   isBanned: boolean;
// // }

// // export class DmRoomUserDto {
// //   userName: string;
// //   contact: string; 
// // }

// // export class MemberRoomUserDto {
// //   id: number;
// //   userName: string;
// //   userRole: UserRole;
// //   isMuted: boolean;
// //   isKicked: boolean;
// //   isBanned: boolean;
// //   status: string;
// // }
