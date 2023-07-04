import { Controller, Get, Req, Param, UploadedFile , UseInterceptors, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user-dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { Express } from 'express';
import UploadFileHelper from './upload.helper'
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './updateUserProfil.dto';
import { request } from 'https';



@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}

    @Post('avatar')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: 'upload',
				filename: UploadFileHelper.customFileName,
			}),
		}),
	)
	async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        console.log("avatar upload" + file.fieldname + file)
        console.log("avatar upload", file.fieldname, file.path);
        return this.userService.updataAvatar(file.path,req.user);
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
        return await this.userService.updateUserProfile(userDTO);
    }

  
}
