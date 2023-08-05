import { Body, Controller, Get, HttpStatus, Post, Response, Request, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { ResponseMessage } from '../../shared/constants/ResponseMessage';
import { UserService } from './user.service';
import { GetRequest } from '../auth/decorators/get-user.decorator';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';
import { User } from '../../entities/user.entity';
import { IsPublic } from '../auth/guards/auth.guards';
import { FindTodosDto } from '../todo/dto/fetchTodo.dto';

@Controller('user')
@ApiTags('User Module')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseHandlerService: ResponseHandlerModel
  ) {}

  @ApiOperation({
    summary: 'Fetch user data'
  })
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.USER_DATA_FETCHED,
    type: User
  })
  @ApiBadRequestResponse({ description: ResponseMessage.DEVICE_SESSION_EXPIRED })
  @ApiConflictResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR
  })
  @ApiBearerAuth()
  @Get('get-user')
  async fetchUser(@GetRequest() request, @Response() response): Promise<any> {
    const { id } = request.user;
    const user = await this.userService.findOne(id);
    delete user.password;
    return this.responseHandlerService.response(user, HttpStatus.OK, response);
  }

  @IsPublic()
  @Get('get-all')
  async fetchAllUser(@Query() findTodosDto: FindTodosDto, @Response() response): Promise<any> {
    const data = await this.userService.findAll(findTodosDto);
    return this.responseHandlerService.response(data, HttpStatus.OK, response);
  }
}
