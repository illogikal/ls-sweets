import { IsOptional } from 'class-validator';
export class FindAllOrderContainsDto {
  @IsOptional()
  sweetName?: string;

  @IsOptional()
  orderId?: string;
}
