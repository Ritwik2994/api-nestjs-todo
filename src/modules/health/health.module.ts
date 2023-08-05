import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import config from '../../shared/config/config';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), DatabaseModule, TerminusModule],
  controllers: [HealthController]
})
export class HealthModule {}
