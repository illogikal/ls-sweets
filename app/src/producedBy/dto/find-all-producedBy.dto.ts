import { IsOptional, IsString } from 'class-validator';
export class FindAllProducedByDto {
  @IsOptional()
  @IsString()
  sweetName?: string;

  @IsOptional()
  @IsString()
  machineId?: string;
}
