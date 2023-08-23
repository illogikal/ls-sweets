import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { OrderEntity } from '../../order/entities/order.entity';
import { MachineEntity } from '../../machine/entities/machine.entity';

@Entity()
export class SweetEntity {
  @Column()
  name: string;

  @Column('text', { array: true })
  ingredients: string[];

  @Column()
  price: number;

  @Column()
  quantityInStock: number;

  @ManyToMany(() => OrderEntity, (order) => order.sweets)
  @JoinTable()
  orders?: OrderEntity[];

  @ManyToOne(() => MachineEntity, (machine) => machine.sweets)
  @JoinTable()
  machine?: MachineEntity[];
}
