import { IsString } from 'class-validator';
export class CreateProducedByDto {
  @IsString()
  sweetName: string;

  @IsString()
  machineId: string;
}
