import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
export class FindAllSweetDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  machineId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(200)
  quantityLt?: number;
}
