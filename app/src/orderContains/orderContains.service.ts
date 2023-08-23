import { Injectable } from '@nestjs/common';
import { CreateOrderContainsDto } from './dto/create-orderContains.dto';
import { Neo4jService } from 'nest-neo4j';
import { FindAllOrderContainsDto } from './dto/find-all-orderContains.dto';
import { FindOneOrderContainsDto } from './dto/find-one-orderContains.dto';
import { OrderContainsEntity } from './entities/orderContains.entity';

@Injectable()
export class OrderContainsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    createOrderContainsDto: CreateOrderContainsDto,
  ): Promise<OrderContainsEntity> {
    const res = await this.neo4jService.write(
      `MATCH (sweet:Sweet { name: $sweetName })
      MATCH (order:Order { orderId: $orderId })
      CREATE (sweet)-[orderContains:ORDER_CONTAINS {amount: $amount}]->(order)
      RETURN sweet.name as sweetName, order.orderId as orderId, orderContains.amount AS amount;`,
      createOrderContainsDto,
    );
    const sweetName = res.records[0].get('sweetName');
    const orderId = res.records[0].get('orderId');
    const amount = res.records[0].get('amount');
    return {
      orderId,
      sweetName,
      amount,
    };
  }

  async findAll(
    findAllOrderContainsDto: FindAllOrderContainsDto,
  ): Promise<OrderContainsEntity[]> {
    let res;
    if (findAllOrderContainsDto.orderId) {
      res = await this.neo4jService.read(
        `MATCH (sweet:Sweet)-[orderContains:ORDER_CONTAINS]->(order:Order { orderId: $orderId })
        RETURN sweet.name as sweetName, order.orderId as orderId, orderContains.amount AS amount;`,
        findAllOrderContainsDto,
      );
    } else if (findAllOrderContainsDto.sweetName) {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet {name: $sweetName})-[orderContains:ORDER_CONTAINS]->(order:Order)
        RETURN sweet.name as sweetName, order.orderId as orderId, orderContains.amount AS amount;`,
        findAllOrderContainsDto,
      );
    } else {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet)-[orderContains:ORDER_CONTAINS]->(order:Order)
        RETURN sweet.name as sweetName, order.orderId as orderId, orderContains.amount AS amount;`,
        findAllOrderContainsDto,
      );
    }
    return res.records.map((rec) => {
      const sweetName = rec.get('sweetName');
      const orderId = rec.get('orderId');
      const amount = rec.get('amount');
      return {
        orderId,
        sweetName,
        amount,
      };
    });
  }

  async findOne(
    findOneOrderContainsDto: FindOneOrderContainsDto,
  ): Promise<OrderContainsEntity> {
    const res = await this.neo4jService.read(
      `MATCH (sweet: Sweet {name: $sweetName})-[orderContains:ORDER_CONTAINS]->(order:Order { orderId: $orderId })
      RETURN sweet.name as sweetName, order.orderId as orderId, orderContains.amount AS amount;`,
      findOneOrderContainsDto,
    );
    if (res.records[0] == undefined) {
      return null;
    }
    const sweetName = res.records[0].get('sweetName');
    const orderId = res.records[0].get('orderId');
    const amount = res.records[0].get('amount');
    return {
      orderId,
      sweetName,
      amount,
    };
  }

  async remove({ sweetName, orderId }): Promise<void> {
    await this.neo4jService.write(
      `MATCH (sweet: Sweet {name: $sweetName})-[orderContains:ORDER_CONTAINS]->(:Order { orderId: $orderId })
      DELETE orderContains;`,
      {
        sweetName,
        orderId,
      },
    );
    return null;
  }
}
