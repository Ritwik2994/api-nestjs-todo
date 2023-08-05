import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';
import { HelpersService } from 'helpers/helpers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, ResponseHandlerModel, HelpersService],
  exports: [UserService]
})
export class UsersModule {}
