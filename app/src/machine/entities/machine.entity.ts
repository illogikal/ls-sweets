import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SweetEntity } from '../../sweet/entities/sweet.entity';

export enum MachineStatus {
  ACTIVE = ' active',
  INACTIVE = ' inactive',
  OFFLINE = ' offline',
}

@Entity()
export class MachineEntity {
  @PrimaryGeneratedColumn('uuid')
  machineId: string;

  @Column()
  type: string;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: MachineStatus,
    default: MachineStatus.INACTIVE,
  })
  status: MachineStatus;

  @ManyToMany(() => SweetEntity, (sweet) => sweet.machine)
  @JoinTable()
  sweets?: SweetEntity[];
}
