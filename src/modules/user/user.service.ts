import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserRole } from '../auth/enums/role.enum';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';
import { HelpersService } from '../../helpers/helpers.service';
import { User } from '../../entities/user.entity';
import { ResponseMessage } from '../../shared/constants/ResponseMessage';
import { FindTodosDto } from '../todo/dto/fetchTodo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly responseHandlerService: ResponseHandlerModel,
    private helperService: HelpersService
  ) {}

  async create(createUserInput: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserInput;

    const userExist = await this.userRepository.findOne({ email: email.toLowerCase(), role: UserRole.USER });

    if (userExist) {
      this.responseHandlerService.error(ResponseMessage.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const { generatedMaps } = await this.userRepository.insert({
      email: email.toLowerCase(),
      password,
      name,
      role: UserRole.USER
    });

    return generatedMaps[0] as User;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      this.responseHandlerService.error(ResponseMessage.USER_NOT_EXIST, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOneByEmailAndRole(email: string, role: string): Promise<User> {
    const user = await this.userRepository.findOne({
      email: email.toLowerCase(),
      role
    });

    if (user) return user;
    const message = role === UserRole.ADMIN ? ResponseMessage.ADMIN_NOT_EXIST : ResponseMessage.USER_NOT_EXIST;
    this.responseHandlerService.error(message, HttpStatus.NOT_FOUND);
  }

  async findAll(findUserDto: FindTodosDto): Promise<[User[], number]> {
    const { sortField = 'createdAt', sortOrder, limit, page, search } = findUserDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere('(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search)', {
        search: `%${search.toLowerCase()}%`
      });
    }

    queryBuilder.orderBy(`user.${sortField}`, sortOrder);
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    return await queryBuilder.getManyAndCount();
  }

  // async findAll(findTodosDto: FindTodosDto): Promise<any> {
  //   const { sortField, sortOrder, nextPageToken, limit } = findTodosDto;

  //   let query = '';
  //   if (nextPageToken) {
  //     const lastDocumentId = await this.helperService.decryptData(nextPageToken);
  //     query = `WHERE id >= ${lastDocumentId}`;
  //   }
  //   console.log('🚀 ~ file: user.service.ts:73 ~ UserService ~ findAll ~ query:', query);

  //   const queryBuilder = this.userRepository.createQueryBuilder('user');
  //   // queryBuilder.where('todo.userId = :userId', { userId });
  //   queryBuilder.where(query);
  //   // queryBuilder.orderBy(`user.${sortField}`, sortOrder);
  //   queryBuilder.limit(limit + 1);

  //   const currentPageDocuments = await queryBuilder.getMany();
  //   const nextPageEncToken = await this.helperService.generateNextPageToken(currentPageDocuments, limit);

  //   const nextPageDocuments = currentPageDocuments.slice(0, limit);

  //   return {
  //     nextPageToken: nextPageEncToken,
  //     data: nextPageDocuments
  //   };
  // }
}
