import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider, ExceptionsService],
})
export class CloudinaryModule {}
