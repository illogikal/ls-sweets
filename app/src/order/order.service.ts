import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { cypherUpdateObject } from '../util';
import { Neo4jService } from 'nest-neo4j';
import { OrderEntity } from './entities/order.entity';
import { FindAllOrderDto } from './dto/find-all-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const res = await this.neo4jService.write(
      `CREATE (order:Order {
        orderId: $orderId,
        customerName: $customerName,
        status: $status
      })
      RETURN order;`,
      createOrderDto,
    );
    return res.records[0].get('order').properties;
  }

  async findAll(findAllOrderDto: FindAllOrderDto): Promise<OrderEntity[]> {
    let res;
    if (findAllOrderDto.sweetName) {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet {name: $sweetName})-[orderContains:ORDER_CONTAINS]->(order:Order)
        RETURN order;`,
        findAllOrderDto,
      );
    } else if (findAllOrderDto.status) {
      res = await this.neo4jService.read(
        `MATCH (order: Order {status: $status})
        RETURN order;`,
        findAllOrderDto,
      );
    } else {
      res = await this.neo4jService.read(
        `MATCH (order: Order)
        RETURN order;`,
        findAllOrderDto,
      );
    }
    return res.records.map((r) => r.get('order').properties);
  }

  async findOne(orderId: string): Promise<OrderEntity> {
    const res = await this.neo4jService.read(
      `MATCH (order:Order { orderId: $orderId })
      RETURN order;`,
      { orderId },
    );
    return res.records[0].get('order').properties;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const res = await this.neo4jService.write(
      `MATCH (order:Order { orderId: $orderId })
      SET ${cypherUpdateObject('order', updateOrderDto)}
      RETURN order;`,
      {
        orderId,
      },
    );
    return res.records[0].get('order').properties;
  }

  async remove(orderId: string): Promise<null> {
    await this.neo4jService.write(
      `MATCH (order:Order { orderId: $orderId })
      RETURN order;`,
      {
        orderId,
      },
    );
    return null;
  }
}
