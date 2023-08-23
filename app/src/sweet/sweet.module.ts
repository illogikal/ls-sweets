import { Module } from '@nestjs/common';
import { SweetService } from './sweet.service';
import { SweetController } from './sweet.controller';

@Module({
  controllers: [SweetController],
  providers: [SweetService],
})
export class SweetModule {}
