import { Controller, Get, Param } from '@nestjs/common';
import {GameService} from './game.service';
import { GameEntity } from 'src/typeorm/game.entity';

@Controller('game')
export class GameController {
    constructor( private gameService: GameService ) {}

    @Get('/:playerId')
    async getGamesByPlayerId(@Param('playerId') playerId: string): Promise<GameEntity[]> {
        return this.gameService.getGamesByPlayerId(Number(playerId));
    }
}
