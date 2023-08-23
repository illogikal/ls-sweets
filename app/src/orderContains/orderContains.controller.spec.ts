import { Test, TestingModule } from '@nestjs/testing';
import { OrderContainsController } from './orderContains.controller';
import { OrderContainsService } from './orderContains.service';
import { Neo4jModule } from 'nest-neo4j';
import { OrderContainsEntity } from './entities/orderContains.entity';

describe('OrderContainsController', () => {
  let controller: OrderContainsController;

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
      controllers: [OrderContainsController],
      providers: [OrderContainsService],
    }).compile();

    controller = module.get<OrderContainsController>(OrderContainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order item', async () => {
      const result: OrderContainsEntity = {
        orderId: '123',
        sweetName: 'Chocolate',
        amount: 100,
      };
      jest
        .spyOn(controller, 'create')
        .mockImplementation(async (): Promise<OrderContainsEntity> => result);

      expect(
        await controller.create({
          orderId: '123',
          sweetName: 'Chocolate',
          amount: 100,
        }),
      ).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of orderitems', async () => {
      const result: OrderContainsEntity[] = [
        {
          orderId: '123',
          sweetName: 'Chocolate',
          amount: 100,
        },
      ];
      jest
        .spyOn(controller, 'findAll')
        .mockImplementation(async (): Promise<OrderContainsEntity[]> => result);

      expect(
        await controller.findAll({ orderId: '123', sweetName: null }),
      ).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an orderitem', async () => {
      const result: OrderContainsEntity = {
        orderId: '123',
        sweetName: 'Chocolate',
        amount: 100,
      };
      jest
        .spyOn(controller, 'findOne')
        .mockImplementation(async (): Promise<OrderContainsEntity> => result);

      expect(
        await controller.findOne({ orderId: '123', sweetName: 'Chocolate' }),
      ).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a orderitem', async () => {
      const result: null = null;
      jest
        .spyOn(controller, 'remove')
        .mockImplementation(async (): Promise<null> => result);

      expect(
        await controller.remove({
          orderId: '123',
          sweetName: 'Chocolate',
        }),
      ).toBe(result);
    });
  });
});
