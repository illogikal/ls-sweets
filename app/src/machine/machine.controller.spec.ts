import { Test, TestingModule } from '@nestjs/testing';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { Neo4jModule } from 'nest-neo4j';
import { MachineEntity, MachineStatus } from './entities/machine.entity';

describe('MachineController', () => {
  let controller: MachineController;
  let service: MachineService;

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
      controllers: [MachineController],
      providers: [MachineService],
    }).compile();

    controller = module.get<MachineController>(MachineController);
    service = module.get<MachineService>(MachineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return an array of machines', async () => {
      const result: MachineEntity[] = [];
      jest
        .spyOn(service, 'create')
        .mockImplementation(async (): Promise<MachineEntity[]> => result);

      expect(
        await controller.create({
          machineId: '123',
          type: '123',
          capacity: 1000,
          status: MachineStatus.ACTIVE,
        }),
      ).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of machines', async () => {
      const result: MachineEntity[] = [];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async (): Promise<MachineEntity[]> => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of machines', async () => {
      const result: MachineEntity[] = [];
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async (): Promise<MachineEntity[]> => result);

      expect(await controller.findOne('123')).toBe(result);
    });
  });

  describe('update', () => {
    it('should return an updated machine', async () => {
      const result: MachineEntity = {
        machineId: '123',
        type: 'Chocolate',
        capacity: 1000,
        status: MachineStatus.ACTIVE,
      };
      jest
        .spyOn(service, 'update')
        .mockImplementation(async (): Promise<MachineEntity> => result);

      expect(await controller.update('123', result)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a machine', async () => {
      const result: null = null;
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async (): Promise<null> => result);

      expect(await controller.remove('123')).toBe(result);
    });
  });
});
