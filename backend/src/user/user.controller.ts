import { Controller, Get, Body, Param } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { UserService } from './user.service';



@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}


    @Get('addFriends')
    async addFriends() {
      console.log("burda");
  
      const friendResponse = await this.userService.addFriend();
  
      console.log(friendResponse + " frontend");
  
      return friendResponse;
    }
    
    @Get('all')
    getAllUser(){
        console.log("\n\nget all user\n\n")
        return this.userService.findByAllUser();
    }



    @Get(':intraId')
    getUserByIntraId(@Param('intraId') id: string){
        return this.userService.findByIntraID(id)
    }

 
  
  
}
