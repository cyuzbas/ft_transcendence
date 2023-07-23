import { OnGatewayConnection, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { Logger } from "@nestjs/common"; 
import { UserService } from "src/user/user.service";
import { RoomDto } from "src/dto/room.dto";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { RoomUserDto } from "src/dto/roomUser.dto";
import { GatewayService, Invite } from "./gateway.service";
import { GameService } from "../game/game.service";
import { Injectable } from '@nestjs/common';


@Injectable()
export class MapService {
  private _userToSocketId = new Map<number, string>();
  get userToSocketId() {
    return this._userToSocketId;
  }
}

@WebSocketGateway( {
	cors: {
		origin: ['http://localhost:3000']
	}
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{
	private logger: Logger = new Logger('MyGateway');

	@WebSocketServer()
	server: Server;

	// private userToSocketId = new Map<number, string>()

	constructor(
		private chatService: ChatService,
		private userService: UserService,
		private gameService: GameService,
		private gatewayService: GatewayService,
		private mapService: MapService) {}
		

	async handleConnection(client: Socket) {
		// console.log('here')
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client connected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);

		const user = await this.userService.findUserByUserName(userSocket.name);
		if(!user)
			return
		console.log('client.id: ', client.id);
		client.join(user.id.toString());
		client.emit('userId', user.id);
		this.mapService.userToSocketId.set(user.id, client.id);
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
		this.server.emit('userStatus', users);
	}

	@SubscribeMessage('memberUpdate') // also leave room?
	async onMemberUpdate(@MessageBody() roomName: string) {
		const members = await this.chatService.getRoomMembers(roomName);
		this.server.to(roomName).emit('memberStatus', members);
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
		this.onMemberUpdate(room.roomName)
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

	// /////////////////////////////////////////////////////////////////////

	@SubscribeMessage('matchMaking')
	async handleMatchMaking( @ConnectedSocket() client: Socket ) {
		console.log('gelmisss');
		if (!client) {
			client.emit('error', "No connection"); ///null oldugu duruma bak  frontende koy
			return;
		}
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		console.log('match making requested for socket', client.id);
		const resQueued = this.gatewayService.addUserToQueue(user.id);
		if (resQueued.status !== true) {
			client.emit('error', resQueued.message);
			return;
		}
		client.emit('queued');
		const resMatching = await this.gatewayService.findMatch();
		if (resMatching.status !== true) {
			client.emit('error', resMatching.message);
            return;
        }
		const [user1, user2] = resMatching.payload;
		const socket1Id = this.mapService.userToSocketId.get(user1.id);
		const socket2Id = this.mapService.userToSocketId.get(user2.id);
		const socket1 = this.server.sockets.sockets.get(socket1Id);
		const socket2 = this.server.sockets.sockets.get(socket2Id);
		
		socket1.emit('matchFound'); //bu oldugunda bir insatlling effecti koyabilirsin?
		socket2.emit('matchFound'); //bu oldugunda bir insatlling effecti koyabilirsin?
		const gameId = [resMatching.payload[0].id, resMatching.payload[1].id].sort().join('vs');
		socket1.join(`game${gameId}`);
		socket2.join(`game${gameId}`);
		if (socket1.rooms.has(`game${gameId}`) && socket2.rooms.has(`game${gameId}`)) {
			console.log(`two users are in the room game${gameId}`);
		} else {
			console.log(`Error: One or both users have not joined game room: game${gameId}`);
		}
		const resGameCreate = await this.gatewayService.createGame(this.server, resMatching.payload[0], resMatching.payload[1]);
		if (resGameCreate.status !== true) {
			if (resGameCreate.message)
			client.emit('error', resGameCreate.message);
			socket1.leave(`game${gameId}`);
			socket2.leave(`game${gameId}`);
			return;
		}
		
		// this.server.to(`game${gameId}`).emit('success', `Found match! Starting the game...`);
		this.server.to(`game${gameId}`).emit('game_info', { p1: resMatching.payload[0].id, p2: resMatching.payload[1].id });
		this.server.to(`game${gameId}`).emit('gameFound');
		console.log(resMatching.payload[0].id,' and ', resMatching.payload[1].id, 'oyuna baslayacak');
		// if(user.id === resMatching.payload[0].id) {
		this.gameService.startGame(this.gatewayService.getGameByGameId(gameId));
		// }
		// return;
	}

	@SubscribeMessage('cancelMatching')
    async cancelMatch( @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		const resUnqueued = this.gatewayService.deleteUserFromQueue(user.id);
		if (resUnqueued.status !== true) {
			client.emit('error', resUnqueued.message);
			return;
		}
        client.emit('gameUnqueued');
    }

	@SubscribeMessage('Invite')
    async inviteUser( @MessageBody() data: { userName: string }, @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		console.log(data.userName);
		console.log(data.userName);

        if (!data.userName) {
			client.emit('error', 'empty username');
            return;
        }
        const target = await this.userService.findUserByUserName(data.userName);
		if (!target) {
			client.emit('error', 'Invalid user');
			return;
		}
		this.gatewayService.uninviteUser(user.id, target?.id );
		console.log(user.id, target.id);
        const res = this.gatewayService.inviteUser(user.id, target?.id );
        if (res.status !== true) {
			console.log(res.message);
			client.emit('error', res.message);
            return;
        }
		console.log("yes", user.userName);
        const invite = this.gatewayService.getInvites(target.id).find(i => i.id === user.id);
        console.log(invite);
		client.emit('invitesent', { ...invite, userName: target.userName });
        this.sendSocketMsgByUserId(target.id, 'gameinvite', { ...invite, userName: user.userName, id: user.id });
    }

    @SubscribeMessage('Uninvite')
    async uninviteUser( @MessageBody() data: { userName: string }, @ConnectedSocket() client: Socket ) {
        const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user || !data.userName ) {
            client.emit('error');
            return;
        }
        const target = await this.userService.findUserByUserName(data.userName);
        const res = this.gatewayService.uninviteUser(user.id, target?.id);
        if (res.status !== true) {
            client.emit('error', res.message);
            return;
        }
        client.emit('invitationCanceled', { ...res.payload, userName: target.userName });
        this.sendSocketMsgByUserId(target.id, 'invitation_deleted', { ...res.payload, userName: user.userName });
        this.sendSocketMsgByUserId(target.id, 'warning', `${user.userName} cancelled their invitation`);
    }

    @SubscribeMessage('AcceptInvitation')
    async acceptInvitation( @MessageBody() data: Invite, @ConnectedSocket() client: Socket ) {
		const userSocket = client.handshake.auth;
		const userDto = await this.userService.findUserByUserName(userSocket.name);
		const user = await this.userService.findUserByUserId(userDto.id);
        if (!user || !('id' in data)) {
			client.emit('error', "Invalid data");
            return;
        }
        const target = await this.userService.findUserByUserId(data.id);
		console.log('baaaak', user.id, target.id);
        const res = this.gatewayService.deleteInvite(user.id, target?.id);
        if (res.status !== true) {
			console.log(res.message);
			client.emit('error', res.message);
            return;
        }
        const resGameCreate = await this.gatewayService.createGame(this.server, user, target);
        if (resGameCreate.status !== true) {
			client.emit('error', resGameCreate.message);
            return;
        }
		const socketId = this.mapService.userToSocketId.get(target.id);
		const socket = this.server.sockets.sockets.get(socketId);
        // if (this.gatewayService.invites.has(resGameCreate.payload[0].player.id)) {
		// 	const invites = this.gatewayService.invites.get(resGameCreate.payload[0].player.id);
        //     invites.forEach((invite) => {
		// 		this.refuseInvite(invite, socket);
        //     });
        // }
        // if (this.gatewayService.invites.has(resGameCreate.payload[1].player.id)) {
		// 	const invites = this.gatewayService.invites.get(resGameCreate.payload[1].player.id);
        //     invites.forEach((invite) => {
		// 		this.refuseInvite(invite, socket);
        //     });
        // }
        const gameId = [resGameCreate.payload[0].player.id, resGameCreate.payload[1].player.id].sort().join('vs');
        client.join(`game${gameId}`);
        socket.join(`game${gameId}`);
        // Notify and remove invite from store
        client.emit('gameAccepted', `You accepted ${target.userName}'s invite`);
        socket.emit('gameAccepted', `Your invitation accepted by ${user.userName}`);
        // client.emit('game_invite_del', { ...res.payload, userName: user.userName });
        this.sendSocketMsgByUserId(target.id, 'success', `${user.userName} accepted your invite`);
        this.sendSocketMsgByUserId(user.id, 'game_invite_accepted', { ...res.payload, userName: user.userName });
        // Stop queue animation and send to game page??
        this.server.to(`game${gameId}`).emit('game_info', { p1: user.id, p2: target.id });
        this.server.to(`game${gameId}`).emit('gameFound');
        this.gameService.startGame(this.gatewayService.getGameByGameId(gameId));
		console.log('accepted');
    }

    // @SubscribeMessage('RejectInvitation')
    // async refuseInvite( @MessageBody() data: Invite, @ConnectedSocket() client: Socket ) {
    //     const userSocket = client.handshake.auth;
	// 	const user = await this.userService.findUserByUserId(userSocket.id);
    //     if (!user || !('id' in data)) {
    //         client.emit('error', "Invalid data");
    //         return;
    //     }
    //     const target = this.gatewayService.getConnectedUserById(data.id);
    //     const res = this.gatewayService.deleteInvite(user.id, target?.id);
    //     if (res.status !== true) {
    //         client.emit('error', res.message);
    //         return;
    //     }
    //     // Notify and remove invite from store
    //     client.emit('success', `You refused ${target.userName}'s invite`);
    //     client.emit('game_invite_del', { ...res.payload, userName: user.userName });
    //     this.sendSocketMsgByUserId(target.id, 'warning', `${user.userName} refused your invite`);
    //     this.sendSocketMsgByUserId(target.id, 'game_invite_refused', { ...res.payload, userName: user.userName });
    // }
	
	@SubscribeMessage('keyDown')
    async KeyDown( @MessageBody() data: string, @ConnectedSocket() client: Socket ) {
        if (!client || !['ArrowUp', 'ArrowDown'].includes(data)) {
            client.emit('error', "Invalid data");
            return ;
        }
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
        if (!user) {
            client.emit('error', 'Invalid user');
            return ;
        }

        let move = 0;
        if (data === 'ArrowUp') move = -1;
        if (data === 'ArrowDown') move = 1;

        const res = this.gatewayService.movePaddle(user.id, move);
        if (res.status !== true) {
            return;
        }
    }

	async sendSocketMsgByUserId(userId: number, event: string, payload: any = null) {
        const client = await this.userService.findUserByUserId(userId);
		// console.log(client)
        const isClientOnline = client.isLogged;
        if (isClientOnline) {
			// console.log('idil');
			const socketId = this.mapService.userToSocketId.get(client.id);
			const socket = this.server.sockets.sockets.get(socketId);
			if (socket) {
				socket.emit(event, payload);
			} else {
				console.error(`No socket found for ID: ${socketId}`);
			}
        }
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