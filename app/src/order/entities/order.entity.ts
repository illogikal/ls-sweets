import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SweetEntity } from '../../sweet/entities/sweet.entity';

export enum OrderStatus {
  OPEN = 'open',
  CANCELED = 'canceled',
  PENDING = 'pending',
  DELIVERED = 'delivered',
}

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column()
  customerName: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @ManyToMany(() => SweetEntity, (sweet) => sweet.orders)
  @JoinTable()
  sweets?: SweetEntity[];
}
