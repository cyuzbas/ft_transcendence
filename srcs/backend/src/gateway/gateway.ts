import { OnGatewayConnection, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { Logger } from "@nestjs/common"; 
import { UserService } from "src/user/user.service";
import { RoomDto } from "src/dto/room.dto";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { RoomUserDto } from "src/dto/roomUser.dto";

@WebSocketGateway( {
	cors: {
		origin: ['http://localhost:3000']
	}
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{
	private logger: Logger = new Logger('MyGateway');

	@WebSocketServer()
	server: Server;

	constructor(
		private chatService: ChatService,
		private userService: UserService){}

	async handleConnection(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client connected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);

		const user = await this.userService.findUserByUserName(userSocket.name);
		if(!user)
			return

		client.join(user.id.toString());
		// client.emit('userId', user.id);

		await this.userService.updateStatus(userSocket.name, 'online');
		this.onUserUpdate();
	}
	
	async handleDisconnect(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client disconnected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);
		// console.log(client.rooms);
		await this.userService.updateStatus(userSocket.name, 'offline');
		this.onUserUpdate();
	}
	
	@SubscribeMessage('userUpdate') // unneccesary? to have event, only server uses it now
	async onUserUpdate() {
		const users = await this.userService.getAllUsersStatus();
		this.server.emit('onUserUpdate', users);
	}

	@SubscribeMessage('memberUpdate') // also leave room?
	async onMemberUpdate(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		// const userSocket = client.handshake.auth;
		// const members = await this.chatService.getRoomMembers(roomName);
		// if (!roomName) return
		// console.log("MEMBERUPDAT",roomName);
		// console.log(userSocket.name);
		// console.log(members);
		this.server.to(roomName).emit('onMemberUpdate')//, members);
	}

	@SubscribeMessage('memberInvite') // also leave room?
	async onMemberInvite(@MessageBody() selectedUsers: string[]) {
		for (const userName of selectedUsers) {
			const user = await this.userService.findUserByUserName(userName);
			this.server.to(user.id.toString()).emit('onMemberInvite');
		}
	}
	
	@SubscribeMessage('joinRoom') // also leave room?
	async onJoinRoom(@MessageBody() room: RoomDto, @ConnectedSocket() client: Socket) {
		client.join(room.roomName);
		// console.log("JOIN",room.roomName)
		this.onMemberUpdate(room.roomName, client)
		// const users = await this.chatService.getRoomUsers(room.roomName);
		// this.server.to(room.roomName).emit('memberStatus', users); //more elegant way?
	}

	@SubscribeMessage('leaveRoom') // also leave room?
	async onLeaveRoom(@MessageBody() room: RoomDto, @ConnectedSocket() client: Socket) {
		client.leave(room.roomName);
		// console.log("JOIN",room.roomName)
		this.onMemberUpdate(room.roomName, client)
		// const users = await this.chatService.getRoomUsers(room.roomName);
		// this.server.to(room.roomName).emit('memberStatus', users); //more elegant way?
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: MessageDto) {
		const newMessage = await this.chatService.addMessage(message);
		this.server.to(newMessage.roomName).emit('onMessage', newMessage);
	}

	@SubscribeMessage('newDmRoom')
	async onNewDmRoom(@MessageBody() userName: string) { //i'm gining userroom to contact? wrong RoomUser
		const { id } = await this.userService.findUserByUserName(userName);
		this.server.to(id.toString()).emit('onNewDmRoom');
		// {
		// 	...room,
		// 	contact: room.userName,
		// });
	}

	@SubscribeMessage('blockUser')
	async onBlockUser(@MessageBody() { user, blockedUser }: { user: UserDto, blockedUser: UserDto }) {
		await this.userService.blockUser(user.userName, blockedUser.userName); // do with http?
		this.server.to(blockedUser.id.toString()).emit('blockedBy', user);
	}
}



	// @SubscribeMessage('getUserStatus')
	// async getUserStatus(@ConnectedSocket() client: Socket) {
	// 	const users = await this.userService.getAllUsersStatus();
	// 	client.emit('userStatus', users);
	// }
	
	// @SubscribeMessage('getMemberStatus')
	// async getMemberStatus(@MessageBody() body: RoomDto, @ConnectedSocket() client: Socket) {
	// 	const users = await this.chatService.getRoomUsers(body.roomName);
	// 	client.emit('memberStatus', users);
	// }




// handleConnection(client: Socket) {
// 	const user = client.handshake.auth;
// 	// console.log(user);
// 	// this.users.push(user);
// 	client.data.user = user;
// 	this.logger.log(`Client connected: ${client.id}`);
// 	this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`)
// 	this.server.emit('newUserResponse', this.users);
// }

// handleDisconnect(client: Socket) {
// 	const user = client.handshake.auth;
// 	this.users = this.users.filter((users) => users.name !== user.name) 
// 	this.server.emit('newUserResponse', this.users);
// 	this.logger.debug(`Client disconnected: ${client.id}`);
// 	this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`)
// }

// @SubscribeMessage('newUser')
// onNewUser(@MessageBody() body: any) {
// 	this.users.push(body);
// 	// this.logger.log(body);
// 	this.server.emit('onNewUser', this.users);
// }