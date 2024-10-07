import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from './entities/course.entity';
import { Category } from './entities/category.entity';
import { Price } from './entities/price.entity';
import { UserModule } from './module/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CategoryModule } from './module/category/category.module';
import { PriceModule } from './module/price/price.module';
import { Chat } from './entities/chat.entity';
import { Socket } from './entities/socket.entity';
import { ChatModule } from './module/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    JwtModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          extra: {
            insecureAuth: true,
            charset: 'utf8mb4_unicode_ci',
          },
          entities: [User, Course, Category, Price, Chat, Socket],
        };
      },
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    PriceModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'CONFIG_APP',
      useValue: new ConfigService(),
    },
  ],
})
export class AppModule {}
