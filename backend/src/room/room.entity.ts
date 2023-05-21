import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/base-entity";

@Entity('Room')
export class Room extends BaseEntity{

    @Column({type: 'integer'})
  from_user_id: number

  @Column({type: 'integer'})
  to_user_id: number

  @Column({type: 'integer'})
  room_id: number

  @Column({type: 'varchar'})
  message_content: string
}