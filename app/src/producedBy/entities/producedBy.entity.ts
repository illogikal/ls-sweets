import { Entity, Column } from 'typeorm';

@Entity()
export class ProducedByEntity {
  @Column('uuid')
  machineId: string;

  @Column()
  sweetName: string;
}
