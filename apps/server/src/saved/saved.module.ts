import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saved, SavedSchema } from './schemas/saved.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Module({
  controllers: [SavedController],
  providers: [SavedService, ExceptionsService],
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
