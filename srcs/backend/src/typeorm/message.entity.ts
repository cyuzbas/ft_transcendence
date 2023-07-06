import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { RoomEntity } from "./room.entity";
import { UserEntity } from "../typeorm/user.entity";

@Entity()
export class MessageEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.messages, {onDelete: 'SET NULL'}) // set default, "user deleted" // can't delete user maybe uncessecary
	user: UserEntity;

	@Column()
	content: string;

	@ManyToOne(() => RoomEntity, (room) => room.messages, {onDelete: 'CASCADE'})
	room: RoomEntity;

	//date created?
}
