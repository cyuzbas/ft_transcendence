import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { RoomEntity } from "./room.entity";
import { MessageEntity } from "./message.entity";
import { RoomUserEntity } from "./roomUser.entity";

export const ADMIN = 'admin';

@Entity()
@Unique(['userName'])
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column({ name: 'intraId',nullable: true, unique: true })
  	intraId: string;

 	@Column({nullable: true })
	public avatar: string;


	@Column({ nullable: true })
	status: string;


	@Column({})
	isLogged: boolean = false;

	@Column({nullable : true})
	TwoFactorAuth:boolean = false

	@Column({nullable: true})
	twoFactorAuthSecret:string

	@Column({nullable: true})
	rank: number;

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.user)
	roomLinks: RoomUserEntity[];

	@OneToMany(() => RoomUserEntity, roomUser => roomUser.contact)
	contactLinks: RoomUserEntity[];

	@ManyToMany(() => UserEntity, user => user.blockedBy)
	@JoinTable({ name: "block" })
	blocking: UserEntity[];
	
	@ManyToMany(() => UserEntity, user => user.blocking)
	blockedBy: UserEntity[];

	// @JoinTable()
    // @OneToMany(() => GameEntity, game => game.player)
    // games: GameEntity[];

    @Column({
        default: 1
    })
    score: number;

	@Column({
        default: 2
    })
    totalWin: number;

	@Column({
        default: 0
    })
    totalLoose: number;

}
