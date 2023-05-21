import { BaseEntity } from "src/base-entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('Friends')
export class Friends extends BaseEntity{
    @Column({type: 'integer'})
    friend_id: number
}
