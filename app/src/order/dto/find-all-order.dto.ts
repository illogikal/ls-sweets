import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
export class FindAllOrderDto {
  @IsOptional()
  sweetName?: string;

  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
