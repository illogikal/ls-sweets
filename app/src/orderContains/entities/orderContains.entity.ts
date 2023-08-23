import { Entity, Column } from 'typeorm';

@Entity()
export class OrderContainsEntity {
  @Column('uuid')
  orderId: string;

  @Column()
  sweetName: string;

  @Column()
  amount: number;
}
