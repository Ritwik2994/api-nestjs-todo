import { Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Response } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { TodoService } from './todo.service';
import { ResponseHandlerModel } from 'shared/model/response-handler.model';
import { FindTodosDto } from './dto/fetchTodo.dto';
import { GetRequest } from '../auth/decorators/get-user.decorator';
import { ResponseMessage } from '../../shared/constants/ResponseMessage';
import { Todo } from '../../entities/todo.entity';
import { UpdateTodoDto } from './dto/updateTodo.dto';
import { CreateTodoDto } from './dto/createTodo.dto';

@Controller('todo')
@ApiTags('Todo Module')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly responseHandlerService: ResponseHandlerModel
  ) {}

  @ApiOperation({
    summary: 'create new todo'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.DATA_CREATED,
    type: Todo
  })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Post()
  async create(@GetRequest() request, @Query() createTodoDto: CreateTodoDto, @Response() response) {
    const { id } = request.user;
    const todo = await this.todoService.create(id, createTodoDto);
    return this.responseHandlerService.response(todo, HttpStatus.OK, response);
  }

  @ApiOperation({
    summary: 'Get users All todo data'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.DATA_FETCHED,
    type: [Todo]
  })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Get()
  async findAllForUsers(@GetRequest() request, @Query() findTodosDto: FindTodosDto, @Response() response) {
    const { id } = request.user;
    const todos = await this.todoService.findAll(findTodosDto, id);
    return this.responseHandlerService.response(todos, HttpStatus.OK, response);
  }

  @ApiOperation({
    summary: 'Get All todo data'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.DATA_FETCHED,
    type: [Todo]
  })
  @ApiBadRequestResponse({ description: ResponseMessage.DEVICE_SESSION_EXPIRED })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Get('allTodo')
  async findAll(@Query() findTodosDto: FindTodosDto, @Response() response) {
    const todos = await this.todoService.findAll(findTodosDto);
    return this.responseHandlerService.response(todos, HttpStatus.OK, response);
  }

  @ApiOperation({
    summary: 'Update todo data'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.UPDATE_SUCCESS,
    type: Todo
  })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Patch('/:todoId')
  async update(
    @GetRequest() request,
    @Param('todoId') todoId: string,
    @Query() updateTodoDto: UpdateTodoDto,
    @Response() response
  ) {
    const { id } = request.user;
    const todos = await this.todoService.update(id, todoId, updateTodoDto);
    return this.responseHandlerService.response(todos, HttpStatus.OK, response);
  }

  @ApiOperation({
    summary: 'Delete todo data'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.DELETE_SUCCESS
  })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Delete('/:todoId')
  async delete(@GetRequest() request, @Param('todoId') todoId: string, @Response() response) {
    const { id } = request.user;
    const todos = await this.todoService.delete(id, todoId);
    return this.responseHandlerService.response(todos, HttpStatus.OK, response);
  }
}
