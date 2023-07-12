import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDto } from 'src/dto/room.dto';
import { MessageDto } from 'src/dto/message.dto';
import { UserDto } from 'src/dto/user.dto';
import { RoomEntity, GENERAL_CHAT, RoomType } from 'src/typeorm/room.entity';
import { MessageEntity } from 'src/typeorm/message.entity';
import { ADMIN, UserEntity } from 'src/typeorm/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RoomUserEntity, UserRole } from 'src/typeorm/roomUser.entity';
import { RoomUserDto } from 'src/dto/roomUser.dto';

@Injectable()
export class ChatService {
	
	constructor(
		private dataSource: DataSource, //take it out?
		@InjectRepository(RoomEntity)
		private roomRepository: Repository<RoomEntity>,
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(RoomUserEntity)
		private roomUserRepository: Repository<RoomUserEntity>,
	) {}

	async initializeGeneralChatRoom() {
		let [admin, generalChatRoom] = await Promise.all([
			this.userRepository.findOne({ where: { userName: ADMIN } }),
			this.roomRepository.findOne({ where: { roomName: GENERAL_CHAT } }),
		]);

		if (!generalChatRoom) {
			generalChatRoom = this.roomRepository.create({
				roomName: GENERAL_CHAT,
				type: RoomType.PUBLIC,
			});
			await this.dataSource.manager.save(generalChatRoom);

			const newRoomUser = this.roomUserRepository.create({
				userRole: UserRole.OWNER,
				user: admin,
				room: generalChatRoom,
			});
			await this.dataSource.manager.save(newRoomUser);	
		}	
	}

	async createChatRoom(room: RoomDto): Promise<RoomUserDto> {
		const user = await this.userRepository.findOne({
			where: { userName: room.userName }
		});
	
		try {
			const newRoom = this.roomRepository.create({
				roomName: room.roomName,
				type: room.type,
				password: room.password, //HASH
			});
			await this.roomRepository.save(newRoom);
			
			const newRoomUser = this.roomUserRepository.create({
				userRole: UserRole.OWNER,
				user: user,
				room: newRoom,
			});
			await this.roomUserRepository.save(newRoomUser);
			
			const { roomId, roomName, type } = newRoom;
			const { userRole, unreadMessages, isMuted, isKicked, isBanned } = newRoomUser;

			return {
				roomId,
				roomName,
				type,
				unreadMessages,
				userRole,
				isMuted,
				isKicked,
				isBanned,
			}
		} catch (error) {
			throw new HttpException("Couldn't create chat room", HttpStatus.CONFLICT);
		}
	}

	async createDmRoom(roomName: string): Promise<RoomEntity> {
		const existingRoom = await this.roomRepository.findOne({ where: { roomName: roomName } });
	
		if (existingRoom) {
			return existingRoom;
		};

		const newDmRoom = this.roomRepository.create({
			roomName: roomName,
			type: RoomType.DIRECTMESSAGE,
		});

		await this.roomRepository.save(newDmRoom);
		return newDmRoom;
	}
	
	async addDmRoomUser(newDmRoom: RoomEntity, users: string[]): Promise<RoomUserDto> {
		const [user1, user2, existingRoomUser2] = await Promise.all([
			this.userRepository.findOne({ where: { userName: users[0] } }),
			this.userRepository.findOne({ where: { userName: users[1] } }),
			this.roomUserRepository
			.createQueryBuilder('roomUser')
			.leftJoinAndSelect('roomUser.room', 'room')
			.leftJoinAndSelect('roomUser.user', 'user')
			.where('room.roomName = :roomName', { roomName: newDmRoom.roomName })
			.andWhere('user.userName = :userName', { userName: users[1] })
			.getOne(),
		]);

		const newRoomUser1 = this.roomUserRepository.create({
			userRole: UserRole.MEMBER,
			user: user1,
			room: newDmRoom,
			contact: user2,
		});
	
		let roomUser2: RoomUserEntity;

		if (existingRoomUser2) {
			roomUser2 = existingRoomUser2;
		} else {
			const newRoomUser2 = this.roomUserRepository.create({
				userRole: UserRole.MEMBER,
				user: user2,
				room: newDmRoom,
				contact: user1,
			});
			roomUser2 = newRoomUser2;
		}
	
		await this.dataSource.transaction(async manager => {
			await manager.save([newRoomUser1, roomUser2]);
		})
	
		return {
			roomId: newDmRoom.roomId,
			roomName: newDmRoom.roomName,
			type: newDmRoom.type,
			unreadMessages: newRoomUser1.unreadMessages,
			userName: user1.userName,
			contact: user2.userName,
		}
	}

	async addMessage(message: MessageDto): Promise<MessageDto> { //handled by gateway
		const [user, room] = await Promise.all([
			this.userRepository.findOne({ where: { userName: message.userName } }),
			this.roomRepository.findOne({ where: { roomName: message.roomName } }),
		]);
	
		const newMessage = this.messageRepository.create({
			content: message.content,
			user: user,
			room: room,
		});
		await this.messageRepository.save(newMessage);

		return {
			id: newMessage.id,
			content: newMessage.content,
			userName: user.userName,
			roomName: room.roomName,
		}
	}

	async addChatRoomUser(roomName: string, userName: string, userRole: UserRole) {
		const [room, user] = await Promise.all([
			this.roomRepository.findOne({ where: {roomName: roomName} }),
			this.userRepository.findOne({ where: {userName: userName} }),
		]);

		const newRoomUser = this.roomUserRepository.create({
			userRole: userRole,
			user: user,
			room: room,
		});
		await this.roomUserRepository.save(newRoomUser);

		const { roomId, type } = room;
		const { unreadMessages, isMuted, isKicked, isBanned } = newRoomUser;

		return {
			roomId,
			roomName,
			type,
			unreadMessages,
			userRole,
			isMuted,
			isKicked,
			isBanned,
		}
	}
	
	async removeRoomUser(roomName: string, userName: string): Promise<void> {
		const roomUser = await this.roomUserRepository
			.createQueryBuilder('roomUser')
			.leftJoinAndSelect('roomUser.room', 'room')
			.leftJoinAndSelect('roomUser.user', 'user')
			.where('room.roomName = :roomName', { roomName })
			.andWhere('user.userName = :userName', { userName })
			.getOne();
			
		await this.roomUserRepository.delete(roomUser);
	}
	
	async updateRoom(updatedRoom: RoomDto): Promise<void> {
		const room = await this.roomRepository.findOne({
			where: { roomId: updatedRoom.roomId }
		});

		room.password = updatedRoom.password;
		room.type = updatedRoom.type;
		await this.roomRepository.save(room);
		
		console.log(updatedRoom)
		console.log(room)
	}

	async updateRoomUser(roomName: string, userName: string, updatedRoomUser: RoomUserDto) {
		const roomUser = await this.roomUserRepository
		.createQueryBuilder('roomUser')
		.leftJoinAndSelect('roomUser.room', 'room')
		.leftJoinAndSelect('roomUser.user', 'user')
		.where('room.roomName = :roomName', { roomName })
		.andWhere('user.userName = :userName', { userName })
		.getOne();

		if (updatedRoomUser.unreadMessages) {
			roomUser.unreadMessages = updatedRoomUser.unreadMessages;
		} else {
			roomUser.userRole = updatedRoomUser.userRole;
			roomUser.isBanned = updatedRoomUser.isBanned;
			roomUser.isKicked = updatedRoomUser.isKicked;
			roomUser.isMuted = updatedRoomUser.isMuted;
		}

		await this.roomUserRepository.save(roomUser);
	}

	async checkPassword(room: RoomDto): Promise<boolean> {
		const findRoom = await this.roomRepository.findOne({
			where: {roomName: room.roomName}
		});

		return findRoom.password === room.password;
	}
	
	async getAllPublicChatRooms(): Promise<RoomDto[]> {
		const rooms = await this.roomRepository
		.createQueryBuilder('room')
		.where('room.type != :private', { private: RoomType.PRIVATE })
		.andWhere('room.type != :directMessage', { directMessage: RoomType.DIRECTMESSAGE })
		.getMany();
		
		const roomData = rooms.map(({ roomId, roomName, type }) => ({
			roomId,
			roomName,
			type,
		}));

		return roomData as RoomDto[];
	}

	async getUserChatRooms(userName: string): Promise<RoomUserDto[]> { //userService??
		const user = await this.userRepository
		.createQueryBuilder('user')
		.leftJoinAndSelect('user.roomLinks', 'roomLinks')
		.leftJoinAndSelect('roomLinks.room', 'room')
		.where('user.userName = :userName', {userName})
		.andWhere('room.type != :roomType', {roomType: RoomType.DIRECTMESSAGE})
		.getOne();
		
		if (!user) {
			return []
		}

		const roomUserData = user.roomLinks
			.map(({ room, unreadMessages, userRole, isMuted, isBanned, isKicked }) => {
				const { roomId, roomName, type } = room;
				return {
					roomId,
					roomName,
					type,
					unreadMessages,
					userRole,
					isMuted,
					isKicked,
					isBanned,
				}
			});

		return roomUserData as RoomUserDto[]
	}
	
	async getUserDmRooms(userName: string): Promise<RoomUserDto[]> { //userService?
		const user = await this.userRepository
		.createQueryBuilder('user')
		.leftJoinAndSelect('user.roomLinks', 'roomLinks')
		.leftJoinAndSelect('roomLinks.room', 'room')
		.leftJoinAndSelect('roomLinks.contact', 'contact')
		.where('user.userName = :userName', {userName})
		.andWhere('room.type = :roomType', {roomType: RoomType.DIRECTMESSAGE})
		.getOne();
	
		if (!user) { //look for rooms instead of user??
			return []
		}

		const roomUserData = user.roomLinks?.map(({ room, contact, unreadMessages }) => {
			const { roomId, roomName, type } = room;
			const { userName } = contact;
			return {
				roomId,
				roomName,
				type,
				unreadMessages,
				contact: userName,
			}
		});

		return roomUserData as RoomUserDto[];
	}

	
	async getRoomMessages(roomName: string): Promise<MessageDto[]> {
		const room = await this.roomRepository
		.createQueryBuilder('room')
		.leftJoinAndSelect('room.messages', 'messages')
		.leftJoinAndSelect('messages.user', 'user')
		.where('room.roomName = :roomName', {roomName})
		.getOne()
		
		const messageData = room.messages.map(({ user, room, ...message }) => {
			const { userName } = user;
			return {
				userName, // check (sender !== null)??
				...message,
			}
		});

		return messageData as MessageDto[];
	}
	
	async getDefaultChatRoomUser(userName: string): Promise<RoomUserDto> {
		const roomUser = await this.roomUserRepository
			.createQueryBuilder('roomUser')
			.leftJoinAndSelect('roomUser.user', 'user')
			.leftJoinAndSelect('roomUser.room', 'room')
			.where('room.roomName = :roomName', { roomName: GENERAL_CHAT })
			.andWhere('user.userName = :userName', { userName })
			.getOne();
		// console.log(userName)
		// console.log(roomUser)
		const { userRole, unreadMessages, isBanned, isKicked, isMuted } = roomUser;
		const { roomId, roomName, type } = roomUser.room

		return {
			roomId,
			roomName,
			type,
			unreadMessages,
			userRole,
			isMuted,
			isKicked,
			isBanned,
		}
	}
	
	async getRoomMembers(roomName: string): Promise<RoomUserDto[]> { //handled by gatway //maybe name get members
		const room = await this.roomRepository
		.createQueryBuilder('room')
		.leftJoinAndSelect('room.userLinks', 'userLinks')
		.leftJoinAndSelect('userLinks.user', 'user')
		.where('room.roomName = :roomName', {roomName})
		.getOne();
		
		const userData = room.userLinks.map(({ user, userRole, isBanned, isKicked, isMuted }) => {
			const { id, userName, status } = user;
			return {
				id,
				userName,
				userRole,
				isBanned,
				isKicked,
				isMuted,
				status,
			}
		});
		return userData as RoomUserDto[];
	}
	
	async deleteRoom(id: number) {
		this.roomRepository.delete(id);
	}
	

	// async removeRoomUserLinks(roomName: string, userName: string): Promise<void> {
	// 	const [room, user, roomUser] = await Promise.all([
	// 		this.roomRepository.findOne({
	// 			where: { roomName: roomName },
	// 			relations: ['userLinks'],
	// 		}),
	// 		this.userRepository.findOne({ 
	// 			where: { userName: userName },
	// 			relations: ['roomLinks'],
	// 		}), 
	// 		this.roomUserRepository
	// 		.createQueryBuilder('roomUser')
	// 		.leftJoinAndSelect('roomUser.room', 'room')
	// 		.leftJoinAndSelect('roomUser.user', 'user')
	// 		.where('room.roomName = :roomName', { roomName })
	// 		.andWhere('user.userName = :userName', { userName })
	// 		.getOne(),
	// 	]);

	// 	const userLinkIndex = room.userLinks.findIndex(userLink => userLink.id === roomUser.id);
	// 	const roomLinkIndex = user.roomLinks.findIndex(roomLink => roomLink.id === roomUser.id);
	
	// 	if (roomLinkIndex !== -1 && userLinkIndex !== -1) {
	// 		room.userLinks.splice(roomLinkIndex, 1);
	// 		user.roomLinks.splice(roomLinkIndex, 1);
	// 		await this.dataSource.manager.save([room, user]);
	// 	};
	// }

	// async createDmRoom(room: RoomDto): Promise<RoomUserDto> {
	// 	const [user1, user2, existingRoom] = await Promise.all([
	// 		this.userRepository.findOne({ where: { userName: room.member[0] } }),
	// 		this.userRepository.findOne({ where: { userName: room.member[1] } }),
	// 		this.roomRepository.findOne({ where: { roomName: room.roomName}}),
	// 	]);

	// 	if (existingRoom) {
	// 		// do something
	// 	}

	// 	const newDmRoom = this.roomRepository.create({
	// 		roomName: room.roomName,
	// 		type: RoomType.DIRECTMESSAGE,
	// 	});
	// 	await this.roomRepository.save(newDmRoom);

	// 	const newRoomUser1 = this.roomUserRepository.create({
	// 		userRole: UserRole.MEMBER,
	// 		user: user1,
	// 		room: newDmRoom,
	// 		contact: user2,
	// 	});

	// 	const newRoomUser2 = this.roomUserRepository.create({
	// 		userRole: UserRole.MEMBER,
	// 		user: user2,
	// 		room: newDmRoom,
	// 		contact: user1,
	// 	});

	// 	await this.dataSource.transaction(async manager => {
	// 		await manager.save([newRoomUser1, newRoomUser2]);
	// 	})

	// 	return {
	// 		roomId: newDmRoom.roomId,
	// 		roomName: newDmRoom.roomName,
	// 		type: newDmRoom.type,
	// 		unreadMessages: newRoomUser1.unreadMessages,
	// 		userName: user1.userName,
	// 		contact: user2.userName,
	// 	}
	// }

	// async getUserDmRooms(userName: string): Promise<RoomUserDto[]> { //userService?
	// 	const user = await this.userRepository
	// 	.createQueryBuilder('user')
	// 	.where('user.userName = :userName', {userName})
	// 	.andWhere('room.type = :roomType', {roomType: RoomType.DIRECTMESSAGE})
	// 	.leftJoinAndSelect('user.roomLinks', 'roomLinks')
	// 	.leftJoinAndSelect('roomLinks.room', 'room')
	// 	.leftJoinAndSelect('roomLinks.contact', 'contact')
	// 	.getOne();

	// 	const roomUserData = user.roomLinks.map(({ room, contact, unreadMessages }) => {
	// 		const { roomId, roomName, type } = room;
	// 		const { userName } = contact;
	// 		return {
	// 			roomId,
	// 			roomName,
	// 			type,
	// 			unreadMessages,
	// 			contact: userName,
	// 		}
	// 	})
	// 	return roomUserData as RoomUserDto[];
	// }
	




	// async initializeGeneralChatRoom() {
	// 	const admin = await this.userRepository.findOne({
	// 		where: { userName: ADMIN }
	// 	});
	// 	let generalChatRoom = await this.roomRepository.findOne({
	// 		where: { roomName: GENERAL_CHAT }
	// 	});
	// 	if (!generalChatRoom) {
	// 		generalChatRoom = this.roomRepository.create({
	// 			roomName: GENERAL_CHAT,
	// 			type: RoomType.PUBLIC,
	// 		});
	// 	}
	// 	const newRoomUser = this.roomUserRepository.create({
	// 		userRole: UserRole.OWNER,
	// 		user: admin,
	// 		room: generalChatRoom,
	// 	});
	// 	admin.roomLinks.push(newRoomUser);
	// 	generalChatRoom.userLinks.push(newRoomUser);
	// 	await this.roomUserRepository.save(newRoomUser);
	// 	await this.userRepository.save(admin);
	// 	await this.roomRepository.save(generalChatRoom);
	// }

	// await this.dataSource.transaction(async manager => {
	// 	// user.roomLinks.push(newRoomUser);
	// 	// newRoom.userLinks.push(newRoomUser);
	// 	await manager.save([newRoomUser, newRoom]); //if above is gone also dont save user
	// });

	// async createChatRoom(room: RoomDto): Promise<RoomUserDto> {
	// 	const user = await this.userRepository.findOne({
	// 		where: { userName: room.creator }
	// 	});
	
	// 	try {
	// 		const newRoom = this.roomRepository.create({
	// 			roomName: room.roomName,
	// 			type: room.type,
	// 			password: room.password, //HASH
	// 		});

	// 		const newRoomUser = this.roomUserRepository.create({
	// 			userRole: UserRole.OWNER,
	// 			user: user,
	// 			room: newRoom,
	// 		});

	// 		user.roomLinks.push(newRoomUser);
	// 		newRoom.userLinks.push(newRoomUser);
	// 		await this.roomUserRepository.save(newRoomUser);
	// 		await this.userRepository.save(user);
	// 		await this.roomRepository.save(newRoom);
	// 		const { roomId, roomName, type } = newRoom;
	// 		const { unreadMessages, userRole } = newRoomUser; //also retunr mute etc?
	// 		return {
	// 			roomId,
	// 			roomName,
	// 			type,
	// 			unreadMessages,
	// 			userRole,
	// 		}
	// 	} catch (error) {
	// 		throw new HttpException("Couldn't create room", HttpStatus.CONFLICT);
	// 	}
	// }

	// async addMessage(message: MessageDto): Promise<MessageDto> {
	// 	const user = await this.userRepository.findOne({
	// 		where: { userName: message.userName }
	// 	});

	// 	const room = await this.roomRepository.findOne({
	// 		where: { roomName: message.roomName }
	// 	});

	// 	const newMessage = this.messageRepository.create({
	// 		content: message.content,
	// 		user: user,
	// 		room: room,
	// 	});

	// 	await this.messageRepository.save(newMessage);

	// 	return {
	// 		id: newMessage.id,
	// 		content: newMessage.content,
	// 		userName: user.userName,
	// 		roomName: room.roomName,
	// 	}
	// }

	// async createDmRoom(room: RoomDto): Promise<RoomUserDto> {
	// 	const user1 = await this.userRepository.findOne({
	// 		where: {userName: room.member[0]}
	// 	})
	// 	const user2 = await this.userRepository.findOne({
	// 		where: {userName: room.member[1]}
	// 	})
	// 	const newDmroom = this.roomRepository.create({
	// 		roomName: room.roomName,
	// 		type: RoomType.DIRECTMESSAGE,
	// 	})
	// 	const roomUser1 = this.roomUserRepository.create({
	// 		userRole: UserRole.MEMBER,
	// 		user: user1,
	// 		room: newDmroom,
	// 		contact: user2,
	// 	})
	// 	const roomUser2 = this.roomUserRepository.create({
	// 		userRole: UserRole.MEMBER,
	// 		user: user2,
	// 		room: newDmroom,
	// 		contact: user1,
	// 	})
	// 	user1.roomLinks.push(roomUser1);
	// 	user2.roomLinks.push(roomUser2);
	// 	newDmroom.userLinks.push(roomUser1, roomUser2);
	// 	await this.roomUserRepository.save(roomUser1);
	// 	await this.roomUserRepository.save(roomUser2);
	// 	await this.roomRepository.save(newDmroom);
	// 	return {
	// 		roomId: newDmroom.roomId,
	// 		roomName: newDmroom.roomName,
	// 		type: newDmroom.type,
	// 		unreadMessages: roomUser1.unreadMessages,
	// 		contact: user2.userName,
	// 	}
	// }





	// await this.dataSource.transaction(async manager => {
	// 	await manager.save([room, user, roomUser]);
	// });
	// if (!room)
	// 	throw new HttpException(`room ${roomName} does not exist`, HttpStatus.NOT_FOUND);
}





// async createDmRoom(room: NewRoomDto): Promise<RoomUserDto> {
// 	// console.log(dmroom);
// 	const user1 = await this.userRepository.findOne({
// 		where: {name: room.member[0]}
// 	})
// 	const user2 = await this.userRepository.findOne({
// 		where: {name: room.contact}
// 	})
// 	const newDmroom = this.roomRepository.create({
// 		name: room.name,
// 		type: DIRECTMESSAGE,
// 		owner: user1,
// 		member: [user2],
// 	})
// 	// console.log({...newDmroom})
// 	const { id, name, type } = await this.roomRepository.save(newDmroom);
// 	return { id, name, type, ownerName: user1.name, contact: user2.name }
// 	// return { newDmroom } as roomDto;
// }

// async leaveRoom(roomName: string, userName: string, userRole: string) { //working on this
// 	const room = await this.roomRepository.findOne({
// 		where: { name: roomName }
// 	})
// 	const user = await this.userRepository.findOne({
// 		where: { name: userName }
// 	})
// 	if (userRole === 'admin') {
// 		room.admin = null;
// 	}
// }	

// async addAdmin(userName: string, roomName: string) {
// 	const room = await this.roomRepository.findOne({
// 		where: {name: roomName},
// 		relations: {admin: true},
// 	});
// 	const user = await this.userRepository.findOne({
// 		where: {name: userName}
// 	});
// 	room.admin.push(user);
// 	return await this.roomRepository.save(room);
// }


// async addMember(userName: string, roomName: string) {
// 	const room = await this.roomRepository.findOne({
// 		where: {name: roomName},
// 		relations: {member: true},
// 	});
// 	if (!room)
// 		throw new HttpException(`room ${roomName} does not exist`, HttpStatus.NOT_FOUND);
// 	const user = await this.userRepository.findOne({
// 		where: {name: userName}
// 	});
// 	room.member.push(user);
// 	return await this.roomRepository.save(room);
// }



// async getAllPublicChatRooms(): Promise<RoomDto[]> {
// 	const allRooms = await this.roomRepository.find()

// 	const filteredRooms = allRooms
// 		.filter((room) => room.type !== PRIVATE && room.type !== DIRECTMESSAGE)
// 		.map(({ password, ...room }) => ({ ...room }));

// 	return filteredRooms
// }

// async getAllPublicRooms(): Promise<RoomDto[]> {
// 	const rooms = await this.roomRepository.find()
// 	const filteredRooms = rooms
// 		.filter(({type}) => type !== PRIVATE && type !== DIRECTMESSAGE);
// 	return filteredRooms
// 		.map(({ id, name, type }) => { return { id, name, type }
// 	});
// }







// const roomUserData = user.roomLinks.map(roomLink => {
// 	const { id, user, room, ...roomLinkRest } = roomLink;
// 	const { password, messages, userLinks, ...roomRest} = roomLink.room;
// 	return {
// 		...roomLinkRest,
// 		...roomRest,
// 	}
// })
// const ownerRooms = user.owner
// 	.filter(room => room.type !== DIRECTMESSAGE)
// 	.map(({password, ...room}) => ({ ...room, userRole: "owner" }));

// const adminRooms = user.admin
// 	.map(({password, ...room}) => ({ ...room, userRole: "admin" }));

// const memberRooms = user.member
// 	.filter(room => room.type !== DIRECTMESSAGE)
// 	.map(({password, ...room}) => ({ ...room, userRole: "member" }))

// return [...ownerRooms, ...adminRooms, ...memberRooms] as RoomDto[];
// async getUserChatRooms(userName: string): Promise<RoomDto[]> {
// 	const user = await this.userRepository
// 		.createQueryBuilder('user')
// 		.leftJoinAndSelect('user.owner', 'owner')
// 		.leftJoinAndSelect('user.admin', 'admin')
// 		.leftJoinAndSelect('user.member', 'member')
// 		.where('user.name = :userName', {userName})
// 		.getOne();

// 	const ownerRooms = user.owner
// 		.filter(room => room.type !== DIRECTMESSAGE)
// 		.map(({password, ...room}) => ({ ...room, userRole: "owner" }));

// 	const adminRooms = user.admin
// 		.map(({password, ...room}) => ({ ...room, userRole: "admin" }));

// 	const memberRooms = user.member
// 		.filter(room => room.type !== DIRECTMESSAGE)
// 		.map(({password, ...room}) => ({ ...room, userRole: "member" }))

// 	return [...ownerRooms, ...adminRooms, ...memberRooms] as RoomDto[];
// }

// async getUserDmRooms(userName: string): Promise<RoomDto[]> {
// 	const user = await this.userRepository
// 		.createQueryBuilder('user')
// 		.leftJoinAndSelect('user.owner', 'owner')
// 		.leftJoinAndSelect('user.member', 'member')
// 		.where('user.name = :userName', {userName})
// 		.getOne();

// 	const ownerRooms = user.owner
// 		.filter(room => room.type === DIRECTMESSAGE)
// 		.map(({password, ...room}) => {
// 			const contact = room.name.replace(user.name, '');
// 			return { ...room, contact: contact }
// 		});
// 	// console.log(ownerRooms);
	
// 	const memberRooms = user.member
// 		.filter(room => room.type === DIRECTMESSAGE)
// 		.map(({password, ...room}) => {
// 			const contact = room.name.replace(user.name, '');
// 			return { ...room, contact: contact }
// 		})
// 	// console.log(memberRooms);

// 	return [...ownerRooms, ...memberRooms] as RoomDto[];
// }



// 	const { id, name, status } = room.owner;
// 	const owner = { 
	// 		id,
	// 		name, 
	// 		status, 
	// 		userRole: 'owner'
	// 	};
	// 	const admin = room.admin.map(({id, name, status}) => ({
		// 		id,
		// 		name,
		// 		status,
		// 		userRole: 'admin'
		// 	}));
		// 	const members = room.member.map(({id, name, status}) => ({
			// 		id,
			// 		name,
			// 		status,
			// 		userRole: 'member'
			// 	}));
			
			// 	return [owner, ...admin, ...members];
			// }
			// async getRoomUsersStatus(roomName: string): Promise<UserDto[]> {
				// 	const room = await this.roomRepository
// 		.createQueryBuilder('room')
// 		.leftJoinAndSelect('room.userLinks', 'userLinks')
// 		.leftJoinAndSelect('room.admin', 'admin')
// 		.leftJoinAndSelect('room.member', 'member')
// 		.where('room.name = :roomName', {roomName})
// 		.getOne();

// 	const { id, name, status } = room.owner;
// 	const owner = { 
	// 		id,
	// 		name, 
	// 		status, 
	// 		userRole: 'owner'
	// 	};
	// 	const admin = room.admin.map(({id, name, status}) => ({
		// 		id,
		// 		name,
		// 		status,
		// 		userRole: 'admin'
		// 	}));
		// 	const members = room.member.map(({id, name, status}) => ({
			// 		id,
			// 		name,
			// 		status,
			// 		userRole: 'member'
			// 	}));
			
			// 	return [owner, ...admin, ...members];
			// }
			// return room.messages.map(({ sender, ...message }) => { 
			// 	if (sender !== null)
			// 		return { ...message, sender: sender.name }
			// 	else
			// 		return { ...message, sender: 'unknown' }
			// });
			// return room.messages.map(({ sender, content }) => { 
			// 	if (sender !== null)
			// 		return { sender: sender.name, content }
			// 	else
			// 		return { sender: 'unknown', content }
			// });
			// }