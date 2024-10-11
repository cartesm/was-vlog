import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Followers, FollowersSchema } from './schemas/follower.schema';
import { UsersService } from 'src/users/users.service';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [FollowersController],
  providers: [FollowersService, UsersService, CloudinaryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Followers.name,
        schema: FollowersSchema,
      },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
})
export class FollowersModule {}
