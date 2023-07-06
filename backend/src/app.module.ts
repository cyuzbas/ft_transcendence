import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {config} from './orm.config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';

import { MulterModule } from '@nestjs/platform-express';

import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './auth/oauth/oauth.guard';


@Module({
  imports: [TypeOrmModule.forRoot(config), 
            PassportModule.register({session:true}), 
            UserModule,  AuthModule, UserModule,
		        ConfigModule.forRoot({ isGlobal: true }),
            MulterModule.register({
              dest: './upload',
            }),
        ],
  controllers: [AppController],
  providers: [AppService, {provide:APP_GUARD,
                            useClass: AuthenticatedGuard,}],
})
export class AppModule {}
