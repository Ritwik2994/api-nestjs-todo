import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Todo } from '../../entities/todo.entity';
import { HelpersService } from '../../helpers/helpers.service';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';
import { FindTodosDto } from './dto/fetchTodo.dto';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';
import { ResponseMessage } from '../../shared/constants/ResponseMessage';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly configService: ConfigService,
    private readonly responseHandlerService: ResponseHandlerModel,
    private helperService: HelpersService
  ) {}

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const { generatedMaps } = await this.todoRepository.insert({
        ...createTodoDto,
        userId
      });

      return generatedMaps[0] as Todo;
    } catch (error) {
      this.responseHandlerService.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(findTodosDto: FindTodosDto, userId?: string): Promise<[Todo[], number]> {
    const { sortField = 'createdAt', sortOrder, limit, page, search } = findTodosDto;

    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    if (userId) queryBuilder.where('todo.userId = :userId', { userId });

    if (search) queryBuilder.andWhere('LOWER(todo.title) LIKE :search', { search: `%${search.toLowerCase()}%` });

    queryBuilder.orderBy(`todo.${sortField}`, sortOrder);
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    return await queryBuilder.getManyAndCount();
  }

  async findOne(id: string): Promise<Todo> {
    return await this.todoRepository.findOne({ id });
  }

  async update(userId: string, id: string, updateTodoDto: UpdateTodoDto): Promise<string> {
    try {
      const todo = await this.todoRepository.findOne({ where: { id } });

      if (!todo || todo.userId !== userId) {
        this.responseHandlerService.error(
          !todo ? ResponseMessage.NOT_FOUND : ResponseMessage.UNAUTHORIZED,
          !todo ? HttpStatus.NOT_FOUND : HttpStatus.UNAUTHORIZED
        );
      }

      const keysToUpdate = Object.keys(updateTodoDto).filter((key) => updateTodoDto[key]);

      if (keysToUpdate.includes('status') && typeof updateTodoDto.status === 'string') {
        updateTodoDto.status = updateTodoDto.status === 'true';
      }

      await this.todoRepository.update(
        todo.id,
        keysToUpdate.reduce((data, key) => {
          data[key] = updateTodoDto[key];
          return data;
        }, {})
      );

      return ResponseMessage.UPDATE_SUCCESS;
    } catch (error) {
      this.responseHandlerService.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(userId: string, id: string): Promise<string> {
    try {
      const todo = await this.todoRepository.findOne({ where: { id, userId } });

      if (!todo) {
        this.responseHandlerService.error(ResponseMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const deleteResult = await this.todoRepository.delete({ id });

      if (deleteResult.affected === 0) {
        this.responseHandlerService.error(ResponseMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
      }

      return ResponseMessage.DELETE_SUCCESS;
    } catch (error) {
      this.responseHandlerService.error(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
