import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { History, HistorySchema } from 'src/history/schemas/history.schema';
import { HistoryModule } from 'src/history/history.module';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService, HistoryService],
  imports: [
    HistoryModule,
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: History.name,
        schema: HistorySchema,
      },
    ]),
  ],
})
export class UsersModule {}
