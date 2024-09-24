import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tags, TagsSchema } from './schemas/tag.schema';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
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
