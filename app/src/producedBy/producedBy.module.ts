import { Module } from '@nestjs/common';
import { ProducedByService } from './producedBy.service';
import { ProducedByController } from './producedBy.controller';

@Module({
  controllers: [ProducedByController],
  providers: [ProducedByService],
})
export class ProducedByModule {}
