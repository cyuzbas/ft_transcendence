import { Controller, Get, Req, Param, UseGuards, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/task.dto';
import { UpdateUserProfileDto } from './updateUserProfil.dto';



@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}
    @Get('all')
    getAllUser(){
        console.log("\n\nget all user\n\n")
        return this.userService.findByAllUser();
    }
    @Get(':intraId')
    getUserByintraId(@Param('intraId') id: string){
        return this.userService.findByintraId(id)
    }

    @Post('update-user-profile')
    async updateUserProfile(@Body() userDTO: UpdateUserProfileDto){
        return await this.userService.updateUserProfile(userDTO);
    }

  
}
