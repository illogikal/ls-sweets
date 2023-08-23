import { IsString } from 'class-validator';
export class FindOneOrderContainsDto {
  @IsString()
  sweetName: string;

  @IsString()
  orderId: string;
}
