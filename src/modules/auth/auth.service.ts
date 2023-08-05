import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ResponseMessage } from '../../shared/constants/ResponseMessage';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { HelpersService } from '../../helpers/helpers.service';
import { UserService } from '../user/user.service';
import { argon2verify } from '../../helpers/argon/argon';
import { AuthToken } from '../../entities/authToken.entity';
import { IAuthToken } from './interfaces/auth.interface';
import { IUser } from '../user/interface/user.interface';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly responseHandlerService: ResponseHandlerModel,
    private helperService: HelpersService,
    private readonly userService: UserService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const password = await this.helperService.decryptPassword(createUserDto.password);
    const hashedPassword = await this.helperService.getHashedPassword(password);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword
    });

    const { accessToken, refreshToken } = await this.generateToken(user);
    return { user, accessToken, refreshToken };
  }

  async signIn(loginDto: LoginDto): Promise<any> {
    const { email, password, role } = loginDto;
    const decryptedPassword = await this.helperService.decryptPassword(password);

    const user = await this.verifyUser(email, decryptedPassword, role);
    const { accessToken, refreshToken } = await this.generateToken(user);

    return { user, accessToken, refreshToken };
  }

  async verifyUser(email: string, password: string, role: string): Promise<any> {
    const user = await this.userService.findOneByEmailAndRole(email, role);

    if (!user) {
      this.responseHandlerService.error(ResponseMessage.USER_NOT_EXIST, HttpStatus.NOT_FOUND);
    }

    if (user.password == null) {
      this.responseHandlerService.error(ResponseMessage.EMPTY_PASSWORD, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await argon2verify(user.password, password);

    if (!isPasswordValid) {
      this.responseHandlerService.error(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (user.status && !user.isBlocked) {
      return user;
    }

    this.responseHandlerService.error(ResponseMessage.USER_BLOCKED, HttpStatus.UNAUTHORIZED);
  }

  async verifyAccessToken(token: string, refreshTokenValidate: boolean): Promise<any> {
    let payload;
    const query = {};

    try {
      const secret = this.configService.get(refreshTokenValidate ? 'JWT_REFRESH_SECRET' : 'JWT_ACCESS_SECRET');
      payload = this.jwtService.verify(token, { secret });
      query[refreshTokenValidate ? 'refreshToken' : 'authToken'] = token;
    } catch (err) {
      this.responseHandlerService.error(ResponseMessage.DEVICE_SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findOne(payload.id);

    const sessionInfo = await this.authTokenRepository.findOne({
      userId: user.id,
      ...query,
      isActive: true
    });

    if (!sessionInfo) {
      this.responseHandlerService.error(ResponseMessage.DEVICE_SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private async generateToken(user: IUser): Promise<any> {
    const { id } = user;
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE')
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE')
    });

    await await this.updateAccessToken(id, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  async generateRefreshToken(
    refreshTokenId: string,
    id: string
  ): Promise<{ accessToken: string; refreshToken: string } | any> {
    const sessionInfo = await this.authTokenRepository.findOne({ refreshToken: refreshTokenId });

    if (!sessionInfo) {
      this.responseHandlerService.error(ResponseMessage.DEVICE_SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE')
    });

    const { refreshToken } = await this.updateAccessToken(id, accessToken, refreshTokenId);

    return { accessToken, refreshToken };
  }

  async updateAccessToken(id: string, accessToken: string, refreshToken: string): Promise<IAuthToken> {
    const authToken = await this.authTokenRepository.findOne({ userId: id, refreshToken });

    if (authToken) {
      authToken.authToken = accessToken;
      return this.authTokenRepository.save(authToken);
    } else {
      const newAuthToken = this.authTokenRepository.create({
        userId: id,
        authToken: accessToken,
        refreshToken
      });
      return this.authTokenRepository.save(newAuthToken);
    }
  }
}
