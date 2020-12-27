import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { GqlModuleOptions } from '@nestjs/graphql'
import { JwtModuleOptions } from '@nestjs/jwt'

@Injectable()
export class MemoriesConfigService {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      port: +process.env.POSTGRES_PORT,
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      dropSchema: false,
      migrationsRun: false,
      entities: ['dist/**/*.model.js'],
      migrations: ['src/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    }
  }

  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({
        req,
      }),
      cors: {
        origin: true,
        credentials: true,
      },
      installSubscriptionHandlers: true,
    }
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: +process.env.JWT_EXPIRES_AT },
    }
  }
}
