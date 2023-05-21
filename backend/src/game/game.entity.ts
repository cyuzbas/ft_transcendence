import { BaseEntity } from "src/base-entity";
import { Column, Entity } from "typeorm";

@Entity('Game')
export class Game extends BaseEntity{
    @Column({type: 'integer'})
    game_id: number

    @Column({type: 'integer'})
    player2_score: number
    
    @Column({type: 'integer'})
    player1_score: number
    
    @Column({type: 'integer'})
    player1_id: number
    
    @Column({type: 'integer'})
    player2_id: number
}