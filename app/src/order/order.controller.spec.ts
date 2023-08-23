import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Neo4jModule } from 'nest-neo4j';
import { OrderEntity, OrderStatus } from './entities/order.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

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
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return an array of orders', async () => {
      const result: OrderEntity = {
        orderId: '123',
        customerName: 'John Doe',
        status: OrderStatus.DELIVERED,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(async (): Promise<OrderEntity> => result);

      expect(
        await controller.create({
          orderId: '123',
          customerName: 'John Doe',
          status: OrderStatus.DELIVERED,
        }),
      ).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const result: OrderEntity[] = [
        {
          orderId: '123',
          customerName: 'John Doe',
          status: OrderStatus.DELIVERED,
        },
      ];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async (): Promise<OrderEntity[]> => result);

      expect(await controller.findAll({})).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of orders', async () => {
      const result: OrderEntity = {
        orderId: '123',
        customerName: 'John Doe',
        status: OrderStatus.DELIVERED,
      };
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async (): Promise<OrderEntity> => result);

      expect(await controller.findOne('Chocolate')).toBe(result);
    });
  });

  describe('update', () => {
    it('should return an updated order', async () => {
      const result: OrderEntity = {
        orderId: '123',
        customerName: 'John Doe',
        status: OrderStatus.DELIVERED,
      };
      jest
        .spyOn(service, 'update')
        .mockImplementation(async (): Promise<OrderEntity> => result);

      expect(await controller.update('Chocolate', result)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a order', async () => {
      const result: null = null;
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async (): Promise<null> => result);

      expect(await controller.remove('Chocolate')).toBe(result);
    });
  });
});
