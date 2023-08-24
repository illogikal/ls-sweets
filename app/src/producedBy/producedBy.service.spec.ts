import { Test, TestingModule } from '@nestjs/testing';
import { ProducedByService } from './producedBy.service';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jService } from 'nest-neo4j';
import { SweetService } from '../sweet/sweet.service';
import { MachineService } from '../machine/machine.service';
import { MachineStatus } from '../machine/entities/machine.entity';

describe('ProducedByService', () => {
  let service: ProducedByService;
  let sweetservice: SweetService;
  let machineservice: MachineService;
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
      providers: [ProducedByService],
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
      providers: [ProducedByService, SweetService, MachineService],
    }).compile();

    service = module.get<ProducedByService>(ProducedByService);
    sweetservice = module.get<SweetService>(SweetService);
    machineservice = module.get<MachineService>(MachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a produced by item', async () => {
    await sweetservice.create({
      name: 'Chocolate',
      ingredients: ['cacao', 'milk', 'sugar'],
      price: 1099,
      quantityInStock: 50,
    });
    await machineservice.create({
      machineId: '123',
      type: 'Chocolate',
      capacity: 1000,
      status: MachineStatus.ACTIVE,
    });
    const result = await service.create({
      machineId: '123',
      sweetName: 'Chocolate',
    });
    expect(result).toStrictEqual({
      machineId: '123',
      sweetName: 'Chocolate',
    });
  });

  it('findAll machineId', async () => {
    const result = await service.findAll({ machineId: '123', sweetName: null });
    expect(result[0]).toStrictEqual({
      machineId: '123',
      sweetName: 'Chocolate',
    });
  });

  it('findAll sweetName', async () => {
    const result = await service.findAll({
      machineId: null,
      sweetName: 'Chocolate',
    });
    expect(result[0]).toStrictEqual({
      machineId: '123',
      sweetName: 'Chocolate',
    });
  });

  it('findAll open', async () => {
    const result = await service.findAll({ machineId: null, sweetName: null });
    expect(result[0]).toStrictEqual({
      machineId: '123',
      sweetName: 'Chocolate',
    });
  });

  it('findAll none', async () => {
    const result = await service.findAll({ machineId: '234', sweetName: null });
    expect(result).toStrictEqual([]);
  });

  it('findOne existing', async () => {
    const result = await service.findOne({
      machineId: '123',
      sweetName: 'Chocolate',
    });
    expect(result).toStrictEqual({
      machineId: '123',
      sweetName: 'Chocolate',
    });
  });

  it('findOne non existing', async () => {
    const result = await service.findOne({
      machineId: '234',
      sweetName: 'No Sweet',
    });
    expect(result).toStrictEqual(null);
  });

  it('remove', async () => {
    const result = await service.remove({
      machineId: '123',
      sweetName: 'Chocolate',
    });
    expect(result).toEqual(null);
    const findResult = await service.findOne({
      machineId: '234',
      sweetName: 'No Sweet',
    });
    expect(findResult).toStrictEqual(null);
  });
});
