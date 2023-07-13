import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../typeorm/user.entity";
import { RoomEntity, RoomType } from "./room.entity";

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

@Entity()
export class RoomUserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column() //can keep for joining?
    // roomId: number;

    @Column()
    userRole: UserRole;

    @Column({ default: 0 })
    unreadMessages: number;

    @Column({ default: false })
    isBanned: boolean;
    
    @Column({ default: false })
    isKicked: boolean;
    
    @Column({ default: false })
    isMuted: boolean;

    @ManyToOne(() => UserEntity, user => user.roomLinks, {onDelete: 'CASCADE'})
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.userLinks, {onDelete: 'CASCADE'})
    room: RoomEntity;

    @ManyToOne(() => UserEntity, user => user.contactLinks, { 
        nullable: true,
        // onDelete: 'CASCADE'
    })
    contact: UserEntity;
}
