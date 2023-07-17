import { OnGatewayConnection, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { Logger } from "@nestjs/common"; 
import { UserService } from "src/user/user.service";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { NewRoomUserDto, RoomUserDto } from "src/dto/roomUser.dto";
import { RoomDto } from "src/dto/room.dto";

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
		this.logger.debug(`Client connected: [${userSocket.name}][${userSocket.intraId}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);

		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			return
		}
		// client.join(userSocket.intraId);
		client.join(user.intraId);
		await this.userService.updateStatus(userSocket.name, 'online');
		this.onUserUpdate();
	}
	
	async handleDisconnect(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client disconnected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);
		await this.userService.updateStatus(userSocket.name, 'offline');
		this.onUserUpdate();
	}
	
	@SubscribeMessage('userUpdate')
	async onUserUpdate() {
		const users = await this.userService.getAllUsersStatus();
		this.server.emit('onUserUpdate', users);
	}

	@SubscribeMessage('memberUpdate')
	async onMemberUpdate(@MessageBody() roomName: string) {
		this.server.to(roomName).emit('onMemberUpdate', roomName)
	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		client.join(roomName);
		this.onMemberUpdate(roomName)
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		client.leave(roomName);
		this.onMemberUpdate(roomName)
	}

	@SubscribeMessage('roomInvite')
	async onRoomInvite(@MessageBody() roomUser: RoomUserDto) {
		this.server.to(roomUser.intraId).emit('onRoomInvite', roomUser);
	}

	@SubscribeMessage('roomUserUpdate')
	async onRoomUserUpdate(@MessageBody() roomUser: RoomUserDto) {
		this.server.to(roomUser.intraId).emit('onRoomUserUpdate', roomUser);
	}

	@SubscribeMessage('removeRoomUser')
	async onRemoveRoomUser(@MessageBody() roomUser: RoomUserDto) {
		console.log(roomUser)
		this.server.to(roomUser.intraId).emit('onRemoveRoomUser', roomUser.roomName);
	}

	@SubscribeMessage('roomUpdate')
	async onRoomUpdate(@MessageBody() roomUpdate: RoomDto) {
		// console.log(roomUpdate)
		this.server.to(roomUpdate.roomName).emit('onRoomUpdate', roomUpdate);
	}
	
	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: MessageDto) {
		const newMessage = await this.chatService.addMessage(message);
		this.server.to(newMessage.roomName).emit('onMessage', newMessage);
	}

	@SubscribeMessage('blockUser')
	async onBlockUser(@MessageBody() { user, blockedUser }: { user: UserDto, blockedUser: UserDto }) {
		await this.userService.blockUser(user.userName, blockedUser.userName); // do with http?
		this.server.to(blockedUser.id.toString()).emit('blockedBy', user);
	}
}
