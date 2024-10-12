import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT'), 10),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
  });