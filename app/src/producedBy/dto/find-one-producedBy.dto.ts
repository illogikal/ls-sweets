import { IsString } from 'class-validator';
export class FindOneProducedByDto {
  @IsString()
  sweetName: string;

  @IsString()
  machineId: string;
}
