import { IsString, IsInt, Min, Max } from 'class-validator';
export class CreateOrderContainsDto {
  @IsString()
  sweetName: string;

  @IsString()
  orderId: string;

  @IsInt()
  @Min(0)
  @Max(200)
  amount: number;
}
