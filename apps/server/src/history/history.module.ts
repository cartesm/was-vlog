import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './schemas/history.schema';
import { UsersModule } from 'src/users/users.module';
import { FollowersModule } from 'src/followers/followers.module';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
  ],
})
export class HistoryModule {}
