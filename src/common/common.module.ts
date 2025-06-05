import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UploadService } from './upload.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 60,
      }),
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    { provide: APP_FILTER, useClass: ErrorFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    UploadService,
  ],
  exports: [PrismaService, ValidationService, UploadService],
})
export class CommonModule {}
