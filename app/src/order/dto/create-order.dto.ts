import { IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
export class CreateOrderDto {
  @IsString()
  orderId: string;

  @IsString()
  customerName: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
