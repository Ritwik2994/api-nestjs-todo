import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';
import { Todo } from '../../entities/todo.entity';
import { HelpersService } from '../../helpers/helpers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, ResponseHandlerModel, HelpersService]
})
export class TodoModule {}
