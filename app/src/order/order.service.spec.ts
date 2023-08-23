import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jService } from 'nest-neo4j';
import { OrderStatus } from './entities/order.entity';

describe('OrderService', () => {
  let service: OrderService;
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
      providers: [OrderService],
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
        }),
      ],
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const result = await service.create({
      orderId: '123',
      customerName: 'John Doe',
      status: OrderStatus.OPEN,
    });
    expect(result).toStrictEqual({
      orderId: '123',
      customerName: 'John Doe',
      status: OrderStatus.OPEN,
    });
  });

  it('findAll', async () => {
    const result = await service.findAll();
    expect(result[0]).toStrictEqual({
      orderId: '123',
      customerName: 'John Doe',
      status: OrderStatus.OPEN,
    });
  });

  it('findOne', async () => {
    const result = await service.findOne('123');
    expect(result).toStrictEqual({
      orderId: '123',
      customerName: 'John Doe',
      status: OrderStatus.OPEN,
    });
  });

  it('update', async () => {
    const result = await service.update('123', {
      customerName: 'James Doe',
      status: OrderStatus.CANCELED,
    });
    expect(result).toStrictEqual({
      orderId: '123',
      customerName: 'James Doe',
      status: OrderStatus.CANCELED,
    });
  });

  it('remove', async () => {
    const result = await service.remove('123');
    expect(result).toEqual(null);
  });
});
