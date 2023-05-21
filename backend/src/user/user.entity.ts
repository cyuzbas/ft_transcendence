import { Entity, Column} from "typeorm";
import { BaseEntity } from "src/base-entity";


@Entity('User')
export class User extends BaseEntity{
    
@Column({type: 'integer'})
user_id: number

@Column({type: 'varchar'})
password: string

@Column({type: 'varchar'})
nick_name: string

@Column({type: 'bool'})
is_online: boolean
}