import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('TYPEORM_HOST'),
          port: +configService.get('TYPEORM_PORT'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          database: configService.get('TYPEORM_DATABASE'),
          entities: [__dirname + '/../entities/*.entity.{ts,js}'],
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 2
          // ssl: { rejectUnauthorized: false },
        };
      }
    })
  ]
})
export class DatabaseModule {}
