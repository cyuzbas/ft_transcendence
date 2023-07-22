import { Controller, Get, Req, Param, Delete, Put, UploadedFile, UseInterceptors, Post, Body, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { UserService } from '../user.service';
import { join } from 'path';

import * as fs from "fs";
import { FriendsService } from './friends.service';
import { UserI } from '../user.interface';

@Controller('friends')
export class FriendsController {
    constructor(private readonly userService: UserService,
        private readonly friendsService: FriendsService) { }

    @Post('add/:myId/:friendId')
    async sendFriendRequest(@Body() requestBody: { myIntraId: string, friendIntraId: string }) {
        const { myIntraId, friendIntraId } = requestBody; 
        const friend = await this.userService.findByintraIdEntitiy(friendIntraId);
        const user = await this.userService.findByintraIdEntitiy(myIntraId);
        
        if (user.id == friend.id) {
            return;
        }
        await this.friendsService.requestFriend(user, friend);
    }

    //get friends query
    @Get('getFriendQuery/:intraId')
    async getFriendQuery(@Param('intraId') intraId: string): Promise<UserI[]> {
        const user = await this.userService.findByintraIdEntitiy(intraId);
        if(!user)
            return null;
        return await this.friendsService.getFriendsQuery(user.id);
    }

    @Post('/delete/:userIntraId/:friendIntraId')
    async deleteFriend(
        @Param('userIntraId') userIntraId:string,
        @Param('friendIntraId') friendIntraId:string
    ) : Promise<Boolean>{
    const friend = await this.userService.findByintraId(friendIntraId);
    const user = await this.userService.findByintraId(userIntraId);
    if(!friend || !user)
    return false;
        return await this.friendsService.deleteFriends(user, friend);

    }

    @Post('/friend-request/:myId/:friendId/:answer')
    async friendRequestAnswer(  
        @Param('myId') myIntraId: string,
        @Param('friendId') friendIntraId: string,
        @Param('answer') answer: boolean,):Promise<Boolean>{
    
    console.log(myIntraId + "gelen" + friendIntraId)
    const friend = await this.userService.findByintraId(friendIntraId);
    const user = await this.userService.findByintraId(myIntraId);
    if(!friend || !user || answer === undefined)
    return false;
        return await this.friendsService.friendRequestAnswer(user, friend,answer)
        
    }

}