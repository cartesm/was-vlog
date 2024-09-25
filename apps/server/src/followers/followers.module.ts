import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Followers, FollowersSchema } from './schemas/follower.schema';

@Module({
  controllers: [FollowersController],
  providers: [FollowersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Followers.name,
        schema: FollowersSchema,
      },
    ]),
  ],
})
export class FollowersModule {}
