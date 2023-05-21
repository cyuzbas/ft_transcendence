import { Entity, Column} from "typeorm";
import { BaseEntity} from "src/base-entity";

@Entity('Message')
export class Message extends BaseEntity{
@Column({type: 'integer'})
  message_id: number

  @Column({type: 'integer'})
  user_id: number

  @Column({type: 'integer'})
  room_id: number

  @Column({type: 'varchar'})
  message_content: string
}