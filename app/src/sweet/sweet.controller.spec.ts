import { Test, TestingModule } from '@nestjs/testing';
import { SweetController } from './sweet.controller';
import { SweetService } from './sweet.service';
import { Neo4jModule } from 'nest-neo4j';
import { SweetEntity } from './entities/sweet.entity';

describe('SweetController', () => {
  let controller: SweetController;
  let service: SweetService;

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
      controllers: [SweetController],
      providers: [SweetService],
    }).compile();

    controller = module.get<SweetController>(SweetController);
    service = module.get<SweetService>(SweetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return an array of sweets', async () => {
      const result: SweetEntity = {
        ingredients: ['chocolate', 'flour', 'sugar'],
        name: 'Chocolate Cake',
        price: 1099,
        quantityInStock: 50,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(async (): Promise<SweetEntity> => result);

      expect(
        await controller.create({
          ingredients: ['chocolate', 'flour', 'sugar'],
          name: 'Chocolate Cake',
          price: 1099,
          quantityInStock: 50,
        }),
      ).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of sweets', async () => {
      const result: SweetEntity[] = [];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async (): Promise<SweetEntity[]> => result);

      expect(await controller.findAll({})).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should find one sweet', async () => {
      const result: SweetEntity = null;
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async (): Promise<SweetEntity> => result);

      expect(await controller.findOne('Chocolate')).toBe(result);
    });
  });

  describe('update', () => {
    it('should return an updated sweet', async () => {
      const result: SweetEntity = {
        ingredients: ['chocolate', 'flour', 'sugar'],
        name: 'Chocolate Cake',
        price: 1099,
        quantityInStock: 50,
      };
      jest
        .spyOn(service, 'update')
        .mockImplementation(async (): Promise<SweetEntity> => result);

      expect(await controller.update('Chocolate', result)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a sweet', async () => {
      const result: null = null;
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async (): Promise<null> => result);

      expect(await controller.remove('Chocolate')).toBe(result);
    });
  });
});
