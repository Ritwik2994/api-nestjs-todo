import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';
import { AuthToken } from '../../entities/authToken.entity';
import { HelpersService } from '../../helpers/helpers.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/user.module';
import { ResponseHandlerModel } from '../../shared/model/response-handler.model';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRE') }
        };
      }
    }),
    TypeOrmModule.forFeature([User, AuthToken])
  ],
  providers: [AuthService, HelpersService, ResponseHandlerModel],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
