import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saved, SavedSchema } from './schemas/saved.schema';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Saved.name,
        schema: SavedSchema,
      },
    ]),
  ],
})
export class SavedModule {}
