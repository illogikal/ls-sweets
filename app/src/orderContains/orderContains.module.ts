import { Module } from '@nestjs/common';
import { OrderContainsService } from './orderContains.service';
import { OrderContainsController } from './orderContains.controller';

@Module({
  controllers: [OrderContainsController],
  providers: [OrderContainsService],
})
export class OrderContainsModule {}
