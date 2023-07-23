import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserEntity} from '../typeorm/user.entity';
import { GameEntity } from '../typeorm/game.entity'
import { UserService } from '../user/user.service'
import { Game } from '../game/game'
import { Server } from 'socket.io';

export type Res<Payload> = {
    status: boolean;
    message: string;
    payload?: Payload;
};

export interface Invite {
    id: number;
}

@Injectable()
export class GatewayService {

    private users: Map<string, UserEntity>;
    public queue: number[];
    public games: Map<string, Game>;
    public invites: Map<number, Invite[]>;

    constructor(
        private userService: UserService,
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>
    ) {
        this.users = new Map();
        this.queue = [];
        this.games = new Map();
        this.invites = new Map();
    }

    addUserToQueue(userId: number) {
        if (this.queue.includes(userId)) {
            return { status: false, message: "You are already in the queue" };
        }
        this.queue.push(userId);
        return { status: true, message: "You are in the queue" };
    }

    async findMatch(): Promise<Res<UserEntity[]>> {
        if (this.queue.length > 1) {
            const queue = this.queue;
            const [p1, p2] = await Promise.all(queue.splice(0, 2).map(p => this.userService.findUserByUserId(p)));
            if (!p1 || !p2)
                return { status: false, message: "Couldn't find any online user" };
            return { status: true, message: "Match found", payload: [p1, p2] };
            }
        return { status: false, message: "Lost connection" };
    }

    async createGame(server: Server, p1: UserEntity, p2: UserEntity): Promise<Res<GameEntity[]>> {
        const gameId = [p1.id, p2.id].sort().join('vs');
        console.log("burda: " , gameId)
        if (this.games.has(gameId)) {
            console.log("varsa: " , gameId)
            
            return { status: true, message: "A game with the same players is already running"};
        }
        console.log('game is created with id: ', gameId);
        let gameP1 = this.gameRepository.create({
            player: p1,
            opponent: p2,
        });
        let gameP2 = this.gameRepository.create({
            player: p2,
            opponent: p1,
        });
        if (!gameP1 || !gameP2) {
            return { status: false, message: "Could not create database objects" };
        }
        try {
            gameP1 = await this.gameRepository.save(gameP1);
            gameP2 = await this.gameRepository.save(gameP2);
        } catch {
            return { status: false, message: "Could not save to database" };
        }
        try {
            this.games.set(gameId, new Game(server, p1.id, p2.id, gameP1.id, gameP2.id));
        } catch {
            await this.gameRepository.delete(gameP1.id);
            await this.gameRepository.delete(gameP2.id);
            return { status: false, message: "Game couldn't initialize" };
        }
        return { status: true, message: 'success', payload: [gameP1, gameP2] };
    }

    endGame(game: Game, gameId: string) {
        // const { server } = this.games.get(gameId);
        game.server.socketsLeave(`game${gameId}`);
        this.games.delete(gameId);
    }

    getConnectedUserById(userId: number) {
        return [...this.users.values()].find((x) => x.id === userId);
    }   /////bunun yerine users service koydun onu game'e de degistirmeyi unutma

    getUserKVByUserId(userId: number) {
        return [...this.users.entries()].find((u) => u[1].id === userId);
    }

    getGameByGameId(gameId: string) {
        return this.games.get(gameId);
    }

    deleteUserFromQueue(userId: number) {
        const index = this.queue.indexOf(userId);
        if (index === -1) {
            return { status: false, message: "You are not in the queue" };
        }
        this.queue.splice(index, 1);
        return { status: true, message: "You have been removed from the queue" };
    }

    movePaddle(userId: number, key: number): Res<boolean> {
        const game  = this.getGameByPlayerId(userId);
        if (!game) {
            return { status: false, message: "Game not found" };
        }
        const userPad = game[game.p1 === userId ? 'paddleLeft' : 'paddleRight'];
        userPad.move = key;
        return { status: true, message: "move done" };
    }

    getGameByPlayerId(userId: number) {
        return [...this.games.values()].find(g => [g.p1, g.p2].includes(userId));
    }

    inviteUser(userId: number, targetUserId: number): Res<boolean> {
        if (targetUserId === userId)
            return { status: false, message: "invitation to yourself?" };
        if (!this.isUserOnline(targetUserId))
            return { status: false, message: "target is offline" };
        if (this.isInGame(targetUserId))
            return { status: false, message: "target is already playing a game" };
        if (this.isInQueue(targetUserId))
            return { status: false, message: "target is already queued for a random game" };
        let targetInvites = this.invites.get(targetUserId) || [];
        if (targetInvites.find(i => i.id === userId))
            return { status: false, message: "invitation send already" };
        targetInvites.push({ id: userId });
        this.invites.set(targetUserId, targetInvites);
        return { status: true, message: "success" };
    }

    uninviteUser(myUserId: number, targetUserId: number): Res<Invite> {
        if (!this.isUserOnline(targetUserId))
            return { status: false, message: "Target is offline" };
        const targetInvites = this.invites.get(targetUserId) || [];
        if (!targetInvites.find(i => i.id === myUserId))
            return { status: false, message: "You haven't invited this user" };
        const deleted = targetInvites.find(i => i.id === myUserId);
        this.invites.set(targetUserId, targetInvites.filter(i => i.id !== myUserId));
        return { status: true, message: "success" };
    }

    deleteInvite(myUserId: number, targetUserId: number): Res<Invite> {
        if (!this.isUserOnline(targetUserId))
            return { status: false, message: "Target is offline" };
        const myInvites = this.invites.get(myUserId) || [];
        if (!myInvites.find(i => i.id === targetUserId))
            return { status: false, message: "no invitation from the user" };
        const deleted = myInvites.find(i => i.id === targetUserId);
        this.invites.set(myUserId, myInvites.filter(i => i.id !== targetUserId));
        return { status: true, message: "success" };
    }

    isInQueue(userId: number) {
        return (this.queue.includes(userId))
    }

    isInGame(userId: number) {
        return [...this.games.values()].find(g => g.p1 === userId || g.p2 === userId)
    }

    async isUserOnline(userId: number)  {
        const user = await this.userService.findUserByUserId(userId);
        return(!!user.isLogged);
        // return (!!this.getConnectedUserById(userId));
    }

    getInvites(userId: number) {
        return this.invites.get(userId);
    }
}