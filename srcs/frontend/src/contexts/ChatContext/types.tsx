import { User } from "../UserContext";

export enum RoomType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected',
	DIRECTMESSAGE = 'directmessage',
}

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

export const GENERAL_CHAT = {
	roomId: 1,
	roomName: 'Transcendence',
	unreadMessages: 0,
	type: RoomType.PUBLIC,
	userRole: UserRole.MEMBER,
	unreadmessages: 0,
	isBanned: false,
	isKicked: false,
	isMuted: false,
	muteEndTime: new Date,
}
export type Message = {
	id: number,
	userName: string,
	content: string,
	roomName: string,
};

export type Room = {
	roomId?: number;
	roomName: string;
	type: RoomType;
	description?: string;
	password?: string;
};

export type UserDetails = {
	unreadMessages: number;
	userRole: UserRole;
	isMuted: boolean;
	isKicked: boolean;
	isBanned: boolean;
	muteEndTime: Date; // run into problems without ? <---
	contactName?: string;
};

export type NewRoomUser = {
	roomName: string,
	userName: string,
	userRole: UserRole,
	intraId?: string,
	contactName?: string,
};

export type RoomUser = Room & UserDetails;
export type Member = User & UserDetails;

// export type NewRoomDetails = {
// 	userName?: string;
// 	member?: string[];
// };


// Specific RoomUser types
// export type NewRoom = Room & NewRoomDetails;
// export type DmRoomUser = RoomUser & RoomUserDetails;//{ contact: string}//, userName: string}; what is this for????

// Member type
// export type Member = User & RoomUserDetails;
// roomId?: number;
// roomName: string;
// type: RoomType;
// Base User type
// export type User = {
	// 	id: number;
	// 	userName: string;
	// 	status: string;
	// 	avatar: string;
	// 	intraId: string;
	// };
	
	// UserRoles type