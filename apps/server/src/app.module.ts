import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBUri } from './configs';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TagsModule } from './tags/tags.module';
import { FollowersModule } from './followers/followers.module';
import { PostsModule } from './posts/posts.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
@Module({
  imports: [
    MongooseModule.forRoot(MongoDBUri),
    CacheModule.register({ isGlobal: true }),
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
    CloudinaryModule,
    TagsModule,
    FollowersModule,
    PostsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [],
})
export class AppModule {}
