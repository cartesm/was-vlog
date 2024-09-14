import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBUri } from './configs';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    MongooseModule.forRoot(MongoDBUri),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['es', 'en'],
        },
        AcceptLanguageResolver,
      ],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
