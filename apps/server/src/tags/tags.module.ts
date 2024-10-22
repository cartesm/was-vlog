import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from './schemas/tag.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, ExceptionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Tags.name,
        schema: TagsSchema,
      },
    ]),
  ],
})
export class TagsModule {}
