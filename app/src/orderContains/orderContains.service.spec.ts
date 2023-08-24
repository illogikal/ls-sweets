import { Test, TestingModule } from '@nestjs/testing';
import { OrderContainsService } from './orderContains.service';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jService } from 'nest-neo4j';
import { SweetService } from '../sweet/sweet.service';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../order/entities/order.entity';

describe('OrderContainsService', () => {
  let service: OrderContainsService;
  let sweetservice: SweetService;
  let orderservice: OrderService;
  let neo4jService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        Neo4jModule.forRoot({
          scheme: 'bolt',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || 7687,
          username: process.env.NEO4J_USERNAME || 'neo4j',
          password: process.env.NEO4J_PASSWORD || 'your_password',
          config: {
            disableLosslessIntegers: true,
          },
        }),
      ],
      providers: [OrderContainsService],
    }).compile();
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await neo4jService.write(
      `MATCH (n)
      DETACH DELETE n;`,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Neo4jModule.forRoot({
          scheme: 'bolt',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || 7687,
          username: process.env.NEO4J_USERNAME || 'neo4j',
          password: process.env.NEO4J_PASSWORD || 'your_password',
          config: {
            disableLosslessIntegers: true,
          },
        }),
      ],
      providers: [OrderContainsService, SweetService, OrderService],
    }).compile();

    service = module.get<OrderContainsService>(OrderContainsService);
    sweetservice = module.get<SweetService>(SweetService);
    orderservice = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    await sweetservice.create({
      name: 'Chocolate',
      ingredients: ['cacao', 'milk', 'sugar'],
      price: 1099,
      quantityInStock: 50,
    });
    await orderservice.create({
      orderId: '123',
      customerName: 'James Doe',
      status: OrderStatus.OPEN,
    });
    const result = await service.create({
      orderId: '123',
      sweetName: 'Chocolate',
      amount: 200,
    });
    expect(result).toStrictEqual({
      orderId: '123',
      sweetName: 'Chocolate',
      amount: 200,
    });
  });

  it('findAll orderId', async () => {
    const result = await service.findAll({ orderId: '123', sweetName: null });
    expect(result[0]).toStrictEqual({
      orderId: '123',
      sweetName: 'Chocolate',
      amount: 200,
    });
  });

  it('findAll sweetName', async () => {
    const result = await service.findAll({
      orderId: null,
      sweetName: 'Chocolate',
    });
    expect(result[0]).toStrictEqual({
      orderId: '123',
      amount: 200,
      sweetName: 'Chocolate',
    });
  });

  it('findAll none', async () => {
    const result = await service.findAll({ orderId: '11111', sweetName: null });
    expect(result).toStrictEqual([]);
  });

  it('findOne existing', async () => {
    const result = await service.findOne({
      orderId: '123',
      sweetName: 'Chocolate',
    });
    expect(result).toStrictEqual({
      orderId: '123',
      amount: 200,
      sweetName: 'Chocolate',
    });
  });

  it('findOne non existing', async () => {
    const result = await service.findOne({
      orderId: '234',
      sweetName: 'No Sweet',
    });
    expect(result).toStrictEqual(null);
  });

  it('remove', async () => {
    const result = await service.remove({
      orderId: '123',
      sweetName: 'Chocolate',
    });
    expect(result).toEqual(null);
    const findResult = await service.findOne({
      orderId: '234',
      sweetName: 'No Sweet',
    });
    expect(findResult).toStrictEqual(null);
  });
});
