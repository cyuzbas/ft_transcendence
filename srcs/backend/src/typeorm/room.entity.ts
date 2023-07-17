import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { MessageEntity } from "./message.entity";
import { RoomUserEntity } from "./roomUser.entity";

export const GENERAL_CHAT = 'Transcendence'
// export const PUBLIC = 'public'
// export const PRIVATE = 'private'
// export const PROTECTED = 'protected'
// export const DIRECTMESSAGE = 'directmessage'

export enum RoomType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected',
	DIRECTMESSAGE = 'directmessage',
}

@Entity()
@Unique(['roomName'])
export class RoomEntity {

	@PrimaryGeneratedColumn()
	roomId: number;

	@Column()
	roomName: string;
	
	@Column()
	type: RoomType;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	password: string;

	@OneToMany(() => MessageEntity, (message) => message.room)
	messages: MessageEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.room)
	userLinks: RoomUserEntity[];
}

// @ManyToOne(() => UserEntity, (user) => user.owner, {onDelete: 'SET NULL'})
// owner: UserEntity;

// @ManyToMany(() => UserEntity, (user) => user.admin, {onDelete: 'CASCADE'})
// admin: UserEntity[];

// @ManyToMany(() => UserEntity, (user) => user.member, {onDelete: 'CASCADE'})
// member: UserEntity[];