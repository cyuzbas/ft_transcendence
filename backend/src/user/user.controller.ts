import { Controller, Get, Req, Param, UploadedFile , UseInterceptors, Post, Body, Res ,StreamableFile, UseGuards} from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user-dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { Express } from 'express';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './updateUserProfil.dto';
import { join } from 'path';
import {AuthenticatedGuard} from '../auth/oauth/oauth.guard'
import * as fs  from "fs";

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}

    @Get('avatar/:filename')
    getImage(@Param('filename') filename: string, @Res() res) {
      const imageFilePath = join(__dirname, '../../upload', filename);
      console.log("filename is  " + filename + " " + imageFilePath)
      return res.sendfile(imageFilePath);
    }
    
    @Post('avatar/:imageName')
        @UseInterceptors(FileInterceptor('avatar'))
        async updateAvatar(
            @Req() req,
            @Param('imageName') imageName : string,
            @UploadedFile() avatar: Express.Multer.File,
	)
    {
        fs.writeFileSync(process.cwd() + "/upload/" + imageName, avatar.buffer);

        return this.userService.updataAvatar(imageName,req.user);
	}

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
        return await this.userService.updateUserProfile(userDTO );
    }

  
}
